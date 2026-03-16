from app.utils.validators import (
    validate_email,
    validate_username,
    validate_password,
    validate_register,
    validate_login,
)


def test_validate_email_valid():
    assert validate_email('user@example.com') is True
    assert validate_email('user.name@domain.co.uk') is True


def test_validate_email_invalid():
    assert validate_email('') is False
    assert validate_email('notanemail') is False
    assert validate_email('@no-user.com') is False
    assert validate_email(None) is False
    assert validate_email(123) is False


def test_validate_username_valid():
    assert validate_username('testuser') is True
    assert validate_username('abc') is True
    assert validate_username('user_123') is True


def test_validate_username_invalid():
    assert validate_username('') is False
    assert validate_username('ab') is False
    assert validate_username('a' * 21) is False
    assert validate_username('user name') is False
    assert validate_username(None) is False
    assert validate_username(123) is False


def test_validate_password_valid():
    assert validate_password('123456') is True
    assert validate_password('longpassword') is True


def test_validate_password_invalid():
    assert validate_password('') is False
    assert validate_password('12345') is False
    assert validate_password(None) is False
    assert validate_password(123456) is False


def test_validate_register_valid():
    data, errors = validate_register({
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123',
    })
    assert errors is None
    assert data['username'] == 'testuser'
    assert data['email'] == 'test@example.com'


def test_validate_register_invalid():
    data, errors = validate_register({
        'username': 'ab',
        'email': 'bad',
        'password': '123',
    })
    assert data is None
    assert 'username' in errors
    assert 'email' in errors
    assert 'password' in errors


def test_validate_register_none():
    data, errors = validate_register(None)
    assert data is None
    assert 'general' in errors


def test_validate_login_valid():
    data, errors = validate_login({
        'email': 'test@example.com',
        'password': 'password123',
    })
    assert errors is None


def test_validate_login_invalid():
    data, errors = validate_login({
        'email': 'bad',
        'password': '',
    })
    assert data is None
    assert 'email' in errors
    assert 'password' in errors


def test_validate_login_none():
    data, errors = validate_login(None)
    assert data is None
    assert 'general' in errors
