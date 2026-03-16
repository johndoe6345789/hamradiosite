from app.utils.auth_helpers import hash_password, verify_password


def test_hash_password():
    hashed = hash_password("mypassword")
    assert "$" in hashed
    assert len(hashed) > 100


def test_verify_password_correct():
    hashed = hash_password("mypassword")
    assert verify_password("mypassword", hashed) is True


def test_verify_password_wrong():
    hashed = hash_password("mypassword")
    assert verify_password("wrongpassword", hashed) is False


def test_verify_password_invalid_hash():
    assert verify_password("password", "nodolaarsign") is False


def test_different_hashes_for_same_password():
    hash1 = hash_password("samepassword")
    hash2 = hash_password("samepassword")
    assert hash1 != hash2  # Different salts
