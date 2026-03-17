import hashlib
import secrets


def hash_password(password):
    """Hash a password using SHA-512 with a random salt."""
    salt = secrets.token_hex(32)
    password_hash = hashlib.sha512(
        (salt + password).encode('utf-8')
    ).hexdigest()
    return f"{salt}${password_hash}"


def verify_password(password, stored_hash):
    """Verify a password against a stored SHA-512 hash."""
    if '$' not in stored_hash:
        return False
    salt, expected_hash = stored_hash.split('$', 1)
    actual_hash = hashlib.sha512((salt + password).encode('utf-8')).hexdigest()
    return secrets.compare_digest(actual_hash, expected_hash)
