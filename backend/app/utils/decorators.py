from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.utils.db import get_db


def admin_required():
    """Decorator that requires the current user to have admin role."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            db = get_db()
            user = db.find_one('users', lambda u: u['id'] == user_id)
            if not user or user.get('role') != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
