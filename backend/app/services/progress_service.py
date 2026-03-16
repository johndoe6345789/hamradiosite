from app.utils.db import get_db


def get_overall_progress(user_id):
    """Get overall progress stats for a user."""
    db = get_db()
    attempts = db.find(
        'quiz_attempts',
        lambda a: a['user_id'] == user_id and a['completed_at'] is not None
    )

    if not attempts:
        return {
            'total_quizzes': 0,
            'total_questions_answered': 0,
            'correct_answers': 0,
            'overall_percentage': 0.0,
            'mock_exams_taken': 0,
            'mock_exams_passed': 0,
        }

    total_questions = sum(a['total'] for a in attempts)
    correct = sum(a['score'] for a in attempts)
    mock_attempts = [a for a in attempts if a['quiz_type'] == 'mock']

    return {
        'total_quizzes': len(attempts),
        'total_questions_answered': total_questions,
        'correct_answers': correct,
        'overall_percentage': round((correct / total_questions * 100), 1) if total_questions > 0 else 0.0,
        'mock_exams_taken': len(mock_attempts),
        'mock_exams_passed': sum(1 for a in mock_attempts if a['passed']),
    }


def get_topic_breakdown(user_id):
    """Get per-topic progress breakdown."""
    db = get_db()
    topics = db.read('topics')
    topics.sort(key=lambda t: t.get('order', 0))

    breakdown = []
    for topic in topics:
        attempts = db.find(
            'quiz_attempts',
            lambda a, tid=topic['id']: (
                a['user_id'] == user_id
                and a['topic_id'] == tid
                and a['completed_at'] is not None
            )
        )

        total_questions = sum(a['total'] for a in attempts)
        correct = sum(a['score'] for a in attempts)

        breakdown.append({
            'topic_id': topic['id'],
            'topic_title': topic['title'],
            'topic_slug': topic['slug'],
            'quizzes_taken': len(attempts),
            'questions_answered': total_questions,
            'correct_answers': correct,
            'percentage': round((correct / total_questions * 100), 1) if total_questions > 0 else 0.0,
        })

    return breakdown


def get_weak_areas(user_id):
    """Get the 3 weakest topic areas."""
    breakdown = get_topic_breakdown(user_id)
    attempted = [t for t in breakdown if t['quizzes_taken'] > 0]
    attempted.sort(key=lambda x: x['percentage'])
    return attempted[:3]


def get_history(user_id, limit=10):
    """Get recent quiz attempt history."""
    db = get_db()
    attempts = db.find(
        'quiz_attempts',
        lambda a: a['user_id'] == user_id and a['completed_at'] is not None
    )
    attempts.sort(key=lambda a: a['completed_at'], reverse=True)
    attempts = attempts[:limit]

    topics = db.read('topics')
    topic_map = {t['id']: t for t in topics}

    results = []
    for a in attempts:
        topic = topic_map.get(a.get('topic_id'))
        results.append({
            'id': a['id'],
            'quiz_type': a['quiz_type'],
            'topic_title': topic['title'] if topic else None,
            'topic_slug': topic['slug'] if topic else None,
            'score': a['score'],
            'total': a['total'],
            'passed': a['passed'],
            'percentage': round((a['score'] / a['total'] * 100), 1) if a['total'] > 0 else 0,
            'completed_at': a['completed_at'],
        })

    return results
