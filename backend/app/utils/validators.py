import re


def validate_email(email):
    """Validate email format."""
    if not email or not isinstance(email, str):
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_username(username):
    """Validate username: 3-20 chars, alphanumeric and underscores."""
    if not username or not isinstance(username, str):
        return False
    return bool(re.match(r'^[a-zA-Z0-9_]{3,20}$', username))


def validate_password(password):
    """Validate password: minimum 6 characters."""
    if not password or not isinstance(password, str):
        return False
    return len(password) >= 6


def validate_register(data):
    """Validate registration data. Returns (cleaned_data, errors)."""
    errors = {}
    if not data:
        return None, {'general': 'No data provided'}

    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not validate_username(username):
        errors['username'] = 'Username must be 3-20 alphanumeric characters'
    if not validate_email(email):
        errors['email'] = 'Invalid email format'
    if not validate_password(password):
        errors['password'] = 'Password must be at least 6 characters'

    if errors:
        return None, errors

    return {'username': username, 'email': email, 'password': password}, None


def validate_login(data):
    """Validate login data. Returns (cleaned_data, errors)."""
    errors = {}
    if not data:
        return None, {'general': 'No data provided'}

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not validate_email(email):
        errors['email'] = 'Invalid email format'
    if not password:
        errors['password'] = 'Password is required'

    if errors:
        return None, errors

    return {'email': email, 'password': password}, None
