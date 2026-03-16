import uuid
import random
from datetime import datetime, timezone

from app.utils.db import get_db

MOCK_EXAM_QUESTION_COUNT = 26
TOPIC_QUIZ_QUESTION_COUNT = 10
MOCK_EXAM_TIME_LIMIT = 3300  # 55 minutes in seconds
PASS_PERCENTAGE = 73


def start_quiz(user_id, quiz_type, topic_slug=None):
    """Start a new quiz. Returns (attempt_dict, error_string)."""
    db = get_db()

    if quiz_type == 'mock':
        questions = db.read('questions')
        random.shuffle(questions)
        selected = questions[:MOCK_EXAM_QUESTION_COUNT]
        topic_id = None
        time_limit = MOCK_EXAM_TIME_LIMIT
    elif quiz_type == 'topic':
        if not topic_slug:
            return None, 'topic_slug is required for topic quizzes'
        topic = db.find_one('topics', lambda t: t['slug'] == topic_slug)
        if not topic:
            return None, 'Topic not found'
        questions = db.find('questions', lambda q: q['topic_slug'] == topic_slug)
        random.shuffle(questions)
        selected = questions[:TOPIC_QUIZ_QUESTION_COUNT]
        topic_id = topic['id']
        time_limit = None
    else:
        return None, 'Invalid quiz type'

    if not selected:
        return None, 'No questions available'

    question_ids = [q['id'] for q in selected]

    attempt = {
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'quiz_type': quiz_type,
        'topic_id': topic_id,
        'topic_slug': topic_slug,
        'question_ids': question_ids,
        'answers': {},
        'score': None,
        'total': len(selected),
        'passed': None,
        'time_limit': time_limit,
        'started_at': datetime.now(timezone.utc).isoformat(),
        'completed_at': None,
    }
    db.insert('quiz_attempts', attempt)

    # Return questions without correct answers
    safe_questions = []
    for q in selected:
        safe_questions.append({
            'id': q['id'],
            'text': q['text'],
            'options': q['options'],
            'topic_id': q.get('topic_id'),
        })

    return {
        'quiz_id': attempt['id'],
        'quiz_type': attempt['quiz_type'],
        'total': attempt['total'],
        'time_limit': attempt['time_limit'],
        'questions': safe_questions,
    }, None


def get_quiz(quiz_id, user_id):
    """Get a quiz attempt. Returns dict or None."""
    db = get_db()
    attempt = db.find_one(
        'quiz_attempts',
        lambda a: a['id'] == quiz_id and a['user_id'] == user_id
    )
    if not attempt:
        return None

    questions = db.read('questions')
    q_map = {q['id']: q for q in questions}

    safe_questions = []
    for qid in attempt['question_ids']:
        q = q_map.get(qid)
        if q:
            safe_questions.append({
                'id': q['id'],
                'text': q['text'],
                'options': q['options'],
                'topic_id': q.get('topic_id'),
            })

    return {
        'quiz_id': attempt['id'],
        'quiz_type': attempt['quiz_type'],
        'total': attempt['total'],
        'time_limit': attempt['time_limit'],
        'questions': safe_questions,
        'completed': attempt['completed_at'] is not None,
    }


def submit_quiz(quiz_id, user_id, answers):
    """Submit quiz answers. Returns (result_dict, error_string)."""
    db = get_db()
    attempt = db.find_one(
        'quiz_attempts',
        lambda a: a['id'] == quiz_id and a['user_id'] == user_id
    )
    if not attempt:
        return None, 'Quiz not found'

    if attempt['completed_at'] is not None:
        return None, 'Quiz already submitted'

    questions = db.read('questions')
    q_map = {q['id']: q for q in questions}

    score = 0
    for qid in attempt['question_ids']:
        q = q_map.get(qid)
        if q and answers.get(qid) == q['correct_option_id']:
            score += 1

    total = attempt['total']
    percentage = round((score / total * 100), 1) if total > 0 else 0
    passed = percentage >= PASS_PERCENTAGE

    db.update(
        'quiz_attempts',
        lambda a: a['id'] == quiz_id,
        {
            'answers': answers,
            'score': score,
            'passed': passed,
            'completed_at': datetime.now(timezone.utc).isoformat(),
        }
    )

    return {
        'quiz_id': quiz_id,
        'score': score,
        'total': total,
        'passed': passed,
        'percentage': percentage,
    }, None


def get_quiz_results(quiz_id, user_id):
    """Get full quiz results with correct answers. Returns dict or None."""
    db = get_db()
    attempt = db.find_one(
        'quiz_attempts',
        lambda a: a['id'] == quiz_id and a['user_id'] == user_id
    )
    if not attempt or attempt['completed_at'] is None:
        return None

    questions = db.read('questions')
    q_map = {q['id']: q for q in questions}
    answers = attempt.get('answers', {})

    results = []
    for qid in attempt['question_ids']:
        q = q_map.get(qid)
        if q:
            user_answer = answers.get(qid)
            results.append({
                'question_id': q['id'],
                'text': q['text'],
                'options': q['options'],
                'correct_option_id': q['correct_option_id'],
                'explanation': q['explanation'],
                'user_answer': user_answer,
                'is_correct': user_answer == q['correct_option_id'],
            })

    return {
        'quiz': {
            'id': attempt['id'],
            'quiz_type': attempt['quiz_type'],
            'score': attempt['score'],
            'total': attempt['total'],
            'passed': attempt['passed'],
            'started_at': attempt['started_at'],
            'completed_at': attempt['completed_at'],
        },
        'results': results,
    }
