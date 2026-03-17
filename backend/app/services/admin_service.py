import uuid

from app.utils.db import get_db
from app.utils.auth_helpers import hash_password


# ── Users ────────────────────────────────────────────────────────────────

def list_users():
    db = get_db()
    users = db.read('users')
    return [_safe_user(u) for u in users]


def get_user(user_id):
    db = get_db()
    user = db.find_one('users', lambda u: u['id'] == user_id)
    if not user:
        return None
    return _safe_user(user)


def update_user(user_id, data):
    db = get_db()
    user = db.find_one('users', lambda u: u['id'] == user_id)
    if not user:
        return None, 'User not found'

    if 'role' in data and data['role'] in ('admin', 'user'):
        user['role'] = data['role']
    if 'username' in data:
        existing = db.find_one(
            'users',
            lambda u: (
                u['username'] == data['username']
                and u['id'] != user_id
            )
        )
        if existing:
            return None, 'Username already taken'
        user['username'] = data['username']
    if 'email' in data:
        existing = db.find_one(
            'users',
            lambda u: (
                u['email'] == data['email']
                and u['id'] != user_id
            )
        )
        if existing:
            return None, 'Email already in use'
        user['email'] = data['email']
    if 'password' in data and data['password']:
        user['password_hash'] = hash_password(data['password'])

    db.update('users', lambda u: u['id'] == user_id, user)
    return _safe_user(user), None


def delete_user(user_id):
    db = get_db()
    return db.delete('users', lambda u: u['id'] == user_id)


# ── Questions ────────────────────────────────────────────────────────────

def list_questions(topic_slug=None):
    db = get_db()
    questions = db.read('questions')
    if topic_slug:
        questions = [q for q in questions if q.get('topic_slug') == topic_slug]
    return questions


def get_question(question_id):
    db = get_db()
    return db.find_one('questions', lambda q: q['id'] == question_id)


def create_question(data):
    db = get_db()
    question = {
        'id': str(uuid.uuid4()),
        'text': data['text'],
        'options': data['options'],
        'correct_option_id': data['correct_option_id'],
        'explanation': data.get('explanation', ''),
        'topic_slug': data['topic_slug'],
        'topic_id': data.get('topic_id', ''),
    }
    db.insert('questions', question)
    return question


def update_question(question_id, data):
    db = get_db()
    question = db.find_one('questions', lambda q: q['id'] == question_id)
    if not question:
        return None

    for field in ('text', 'options', 'correct_option_id',
                  'explanation', 'topic_slug', 'topic_id'):
        if field in data:
            question[field] = data[field]

    db.update('questions', lambda q: q['id'] == question_id, question)
    return question


def delete_question(question_id):
    db = get_db()
    return db.delete('questions', lambda q: q['id'] == question_id)


# ── Topics ───────────────────────────────────────────────────────────────

def list_topics():
    db = get_db()
    topics = db.read('topics')
    topics.sort(key=lambda t: t.get('order', 0))
    return topics


def get_topic(topic_id):
    db = get_db()
    return db.find_one('topics', lambda t: t['id'] == topic_id)


def create_topic(data):
    db = get_db()
    topic = {
        'id': str(uuid.uuid4()),
        'title': data['title'],
        'slug': data['slug'],
        'description': data.get('description', ''),
        'content': data.get('content', ''),
        'icon': data.get('icon', ''),
        'order': data.get('order', 0),
    }
    db.insert('topics', topic)
    return topic


def update_topic(topic_id, data):
    db = get_db()
    topic = db.find_one('topics', lambda t: t['id'] == topic_id)
    if not topic:
        return None

    for field in ('title', 'slug', 'description', 'content', 'icon', 'order'):
        if field in data:
            topic[field] = data[field]

    db.update('topics', lambda t: t['id'] == topic_id, topic)
    return topic


def delete_topic(topic_id):
    db = get_db()
    return db.delete('topics', lambda t: t['id'] == topic_id)


# ── Translations ─────────────────────────────────────────────────────────

def get_translations():
    """Read all translation data from the translations collection."""
    db = get_db()
    translations = db.read('translations')
    if not translations:
        return {}
    result = {}
    for t in translations:
        result[t['locale']] = t['messages']
    return result


def update_translations(locale, messages):
    """Update translation messages for a locale."""
    db = get_db()
    existing = db.find_one('translations', lambda t: t['locale'] == locale)
    if existing:
        existing['messages'] = messages
        db.update(
            'translations',
            lambda t: t['id'] == existing['id'],
            existing
        )
        return existing
    else:
        record = {
            'id': locale,
            'locale': locale,
            'messages': messages,
        }
        db.insert('translations', record)
        return record


# ── Helpers ──────────────────────────────────────────────────────────────

def _safe_user(user):
    return {
        'id': user['id'],
        'username': user['username'],
        'email': user['email'],
        'role': user.get('role', 'user'),
        'created_at': user.get('created_at', ''),
    }
