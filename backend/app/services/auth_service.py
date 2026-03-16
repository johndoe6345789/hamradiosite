import uuid
from datetime import datetime, timezone

from app.utils.db import get_db
from app.utils.auth_helpers import hash_password, verify_password


def register_user(username, email, password):
    """Register a new user. Returns (user_dict, error_string)."""
    db = get_db()

    existing = db.find_one('users', lambda u: u['email'] == email)
    if existing:
        return None, 'Email already registered'

    existing = db.find_one('users', lambda u: u['username'] == username)
    if existing:
        return None, 'Username already taken'

    user = {
        'id': str(uuid.uuid4()),
        'username': username,
        'email': email,
        'password_hash': hash_password(password),
        'role': 'user',
        'created_at': datetime.now(timezone.utc).isoformat(),
    }
    db.insert('users', user)

    return _safe_user(user), None


def authenticate_user(email, password):
    """Authenticate a user. Returns user dict or None."""
    db = get_db()
    user = db.find_one('users', lambda u: u['email'] == email)
    if user is None or not verify_password(password, user['password_hash']):
        return None
    return _safe_user(user)


def get_user_by_id(user_id):
    """Get a user by ID. Returns user dict without password_hash."""
    db = get_db()
    user = db.find_one('users', lambda u: u['id'] == user_id)
    if user:
        return _safe_user(user)
    return None


def _safe_user(user):
    """Return user dict without sensitive fields."""
    return {
        'id': user['id'],
        'username': user['username'],
        'email': user['email'],
        'role': user.get('role', 'user'),
        'created_at': user['created_at'],
    }
