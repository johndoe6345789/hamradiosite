import pytest
from flask_jwt_extended import create_access_token


@pytest.fixture
def admin_user(app, db):
    """Create an admin user and return auth headers."""
    from app.utils.auth_helpers import hash_password
    user = {
        'id': 'admin-1',
        'username': 'admin',
        'email': 'admin@example.com',
        'password_hash': hash_password('AdminPass1'),
        'role': 'admin',
        'created_at': '2024-01-01T00:00:00Z',
    }
    db.insert('users', user)
    with app.app_context():
        token = create_access_token(identity='admin-1')
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def regular_user_headers(app, db):
    """Create a regular user and return auth headers."""
    from app.utils.auth_helpers import hash_password
    user = {
        'id': 'user-1',
        'username': 'regular',
        'email': 'regular@example.com',
        'password_hash': hash_password('UserPass1'),
        'role': 'user',
        'created_at': '2024-01-01T00:00:00Z',
    }
    db.insert('users', user)
    with app.app_context():
        token = create_access_token(identity='user-1')
    return {'Authorization': f'Bearer {token}'}


# ── Admin access control ─────────────────────────────────────────────────

def test_admin_required_rejects_regular_user(client, regular_user_headers):
    response = client.get('/api/admin/users', headers=regular_user_headers)
    assert response.status_code == 403
    assert response.get_json()['error'] == 'Admin access required'


def test_admin_required_rejects_no_auth(client):
    response = client.get('/api/admin/users')
    assert response.status_code == 401


# ── Users CRUD ───────────────────────────────────────────────────────────

def test_list_users(client, admin_user):
    response = client.get('/api/admin/users', headers=admin_user)
    assert response.status_code == 200
    data = response.get_json()
    assert 'users' in data
    assert len(data['users']) >= 1


def test_get_user(client, admin_user):
    response = client.get('/api/admin/users/admin-1', headers=admin_user)
    assert response.status_code == 200
    assert response.get_json()['user']['username'] == 'admin'


def test_get_user_not_found(client, admin_user):
    response = client.get('/api/admin/users/nonexistent', headers=admin_user)
    assert response.status_code == 404


def test_update_user_role(client, admin_user, db):
    from app.utils.auth_helpers import hash_password
    db.insert('users', {
        'id': 'target-1', 'username': 'target', 'email': 'target@example.com',
        'password_hash': hash_password('Pass1234'), 'role': 'user',
        'created_at': '2024-01-01T00:00:00Z',
    })
    response = client.put('/api/admin/users/target-1', headers=admin_user,
                          json={'role': 'admin'})
    assert response.status_code == 200
    assert response.get_json()['user']['role'] == 'admin'


def test_update_user_username(client, admin_user, db):
    from app.utils.auth_helpers import hash_password
    db.insert('users', {
        'id': 'target-2', 'username': 'oldname', 'email': 'old@example.com',
        'password_hash': hash_password('Pass1234'), 'role': 'user',
        'created_at': '2024-01-01T00:00:00Z',
    })
    response = client.put('/api/admin/users/target-2', headers=admin_user,
                          json={'username': 'newname'})
    assert response.status_code == 200
    assert response.get_json()['user']['username'] == 'newname'


def test_update_user_duplicate_username(client, admin_user, db):
    from app.utils.auth_helpers import hash_password
    db.insert('users', {
        'id': 'target-3', 'username': 'dup', 'email': 'dup@example.com',
        'password_hash': hash_password('Pass1234'), 'role': 'user',
        'created_at': '2024-01-01T00:00:00Z',
    })
    response = client.put('/api/admin/users/target-3', headers=admin_user,
                          json={'username': 'admin'})
    assert response.status_code == 400
    assert 'already taken' in response.get_json()['error']


def test_update_user_email(client, admin_user, db):
    from app.utils.auth_helpers import hash_password
    db.insert('users', {
        'id': 'target-email', 'username': 'emailuser', 'email': 'oldemail@example.com',
        'password_hash': hash_password('Pass1234'), 'role': 'user',
        'created_at': '2024-01-01T00:00:00Z',
    })
    response = client.put('/api/admin/users/target-email', headers=admin_user,
                          json={'email': 'newemail@example.com'})
    assert response.status_code == 200
    assert response.get_json()['user']['email'] == 'newemail@example.com'


def test_update_user_duplicate_email(client, admin_user, db):
    from app.utils.auth_helpers import hash_password
    db.insert('users', {
        'id': 'target-4', 'username': 'emaildup', 'email': 'emaildup@example.com',
        'password_hash': hash_password('Pass1234'), 'role': 'user',
        'created_at': '2024-01-01T00:00:00Z',
    })
    response = client.put('/api/admin/users/target-4', headers=admin_user,
                          json={'email': 'admin@example.com'})
    assert response.status_code == 400
    assert 'already in use' in response.get_json()['error']


def test_update_user_password(client, admin_user, db):
    from app.utils.auth_helpers import hash_password
    db.insert('users', {
        'id': 'target-5', 'username': 'pwchange', 'email': 'pw@example.com',
        'password_hash': hash_password('OldPass1'), 'role': 'user',
        'created_at': '2024-01-01T00:00:00Z',
    })
    response = client.put('/api/admin/users/target-5', headers=admin_user,
                          json={'password': 'NewPass1'})
    assert response.status_code == 200


def test_update_user_not_found(client, admin_user):
    response = client.put('/api/admin/users/nonexistent', headers=admin_user,
                          json={'role': 'admin'})
    assert response.status_code == 400


def test_update_user_no_data(client, admin_user):
    response = client.put('/api/admin/users/admin-1',
                          headers={**admin_user, 'Content-Type': 'application/json'},
                          data='')
    assert response.status_code == 400


def test_delete_user(client, admin_user, db):
    from app.utils.auth_helpers import hash_password
    db.insert('users', {
        'id': 'del-1', 'username': 'todelete', 'email': 'del@example.com',
        'password_hash': hash_password('Pass1234'), 'role': 'user',
        'created_at': '2024-01-01T00:00:00Z',
    })
    response = client.delete('/api/admin/users/del-1', headers=admin_user)
    assert response.status_code == 200


def test_delete_user_not_found(client, admin_user):
    response = client.delete('/api/admin/users/nonexistent', headers=admin_user)
    assert response.status_code == 404


# ── Questions CRUD ───────────────────────────────────────────────────────

def test_list_questions(client, admin_user):
    response = client.get('/api/admin/questions', headers=admin_user)
    assert response.status_code == 200
    assert 'questions' in response.get_json()


def test_list_questions_by_topic(client, admin_user):
    response = client.get('/api/admin/questions?topic=licensing', headers=admin_user)
    assert response.status_code == 200


def test_create_question(client, admin_user):
    response = client.post('/api/admin/questions', headers=admin_user, json={
        'text': 'What is 2+2?',
        'options': [{'id': 'a', 'text': '3'}, {'id': 'b', 'text': '4'}],
        'correct_option_id': 'b',
        'topic_slug': 'licensing',
        'explanation': 'Basic math',
    })
    assert response.status_code == 201
    assert response.get_json()['question']['text'] == 'What is 2+2?'


def test_create_question_missing_fields(client, admin_user):
    response = client.post('/api/admin/questions', headers=admin_user, json={
        'text': 'Incomplete question',
    })
    assert response.status_code == 400
    assert 'Missing fields' in response.get_json()['error']


def test_create_question_no_data(client, admin_user):
    response = client.post('/api/admin/questions',
                           headers={**admin_user, 'Content-Type': 'application/json'},
                           data='')
    assert response.status_code == 400


def test_get_question(client, admin_user, db):
    db.insert('questions', {
        'id': 'q-test-1', 'text': 'Test?', 'options': [],
        'correct_option_id': 'a', 'topic_slug': 'licensing',
    })
    response = client.get('/api/admin/questions/q-test-1', headers=admin_user)
    assert response.status_code == 200


def test_get_question_not_found(client, admin_user):
    response = client.get('/api/admin/questions/nonexistent', headers=admin_user)
    assert response.status_code == 404


def test_update_question(client, admin_user, db):
    db.insert('questions', {
        'id': 'q-upd-1', 'text': 'Old?', 'options': [],
        'correct_option_id': 'a', 'topic_slug': 'licensing',
    })
    response = client.put('/api/admin/questions/q-upd-1', headers=admin_user,
                          json={'text': 'Updated?'})
    assert response.status_code == 200
    assert response.get_json()['question']['text'] == 'Updated?'


def test_update_question_not_found(client, admin_user):
    response = client.put('/api/admin/questions/nonexistent', headers=admin_user,
                          json={'text': 'Nope'})
    assert response.status_code == 404


def test_update_question_no_data(client, admin_user):
    response = client.put('/api/admin/questions/q-upd-1',
                          headers={**admin_user, 'Content-Type': 'application/json'},
                          data='')
    assert response.status_code == 400


def test_delete_question(client, admin_user, db):
    db.insert('questions', {
        'id': 'q-del-1', 'text': 'Delete me?', 'options': [],
        'correct_option_id': 'a', 'topic_slug': 'licensing',
    })
    response = client.delete('/api/admin/questions/q-del-1', headers=admin_user)
    assert response.status_code == 200


def test_delete_question_not_found(client, admin_user):
    response = client.delete('/api/admin/questions/nonexistent', headers=admin_user)
    assert response.status_code == 404


# ── Topics CRUD ──────────────────────────────────────────────────────────

def test_list_topics(client, admin_user):
    response = client.get('/api/admin/topics', headers=admin_user)
    assert response.status_code == 200
    assert 'topics' in response.get_json()


def test_create_topic(client, admin_user):
    response = client.post('/api/admin/topics', headers=admin_user, json={
        'title': 'New Topic',
        'slug': 'new-topic',
        'description': 'A new topic',
    })
    assert response.status_code == 201
    assert response.get_json()['topic']['title'] == 'New Topic'


def test_create_topic_missing_fields(client, admin_user):
    response = client.post('/api/admin/topics', headers=admin_user, json={
        'description': 'No title or slug',
    })
    assert response.status_code == 400


def test_create_topic_no_data(client, admin_user):
    response = client.post('/api/admin/topics',
                           headers={**admin_user, 'Content-Type': 'application/json'},
                           data='')
    assert response.status_code == 400


def test_get_topic(client, admin_user, db):
    db.insert('topics', {
        'id': 't-test-1', 'title': 'Test Topic', 'slug': 'test-topic',
        'description': 'desc', 'order': 1,
    })
    response = client.get('/api/admin/topics/t-test-1', headers=admin_user)
    assert response.status_code == 200


def test_get_topic_not_found(client, admin_user):
    response = client.get('/api/admin/topics/nonexistent', headers=admin_user)
    assert response.status_code == 404


def test_update_topic(client, admin_user, db):
    db.insert('topics', {
        'id': 't-upd-1', 'title': 'Old', 'slug': 'old',
        'description': 'old desc', 'order': 1,
    })
    response = client.put('/api/admin/topics/t-upd-1', headers=admin_user,
                          json={'title': 'Updated'})
    assert response.status_code == 200
    assert response.get_json()['topic']['title'] == 'Updated'


def test_update_topic_not_found(client, admin_user):
    response = client.put('/api/admin/topics/nonexistent', headers=admin_user,
                          json={'title': 'Nope'})
    assert response.status_code == 404


def test_update_topic_no_data(client, admin_user):
    response = client.put('/api/admin/topics/t-upd-1',
                          headers={**admin_user, 'Content-Type': 'application/json'},
                          data='')
    assert response.status_code == 400


def test_delete_topic(client, admin_user, db):
    db.insert('topics', {
        'id': 't-del-1', 'title': 'Delete Me', 'slug': 'delete-me',
        'description': 'desc', 'order': 1,
    })
    response = client.delete('/api/admin/topics/t-del-1', headers=admin_user)
    assert response.status_code == 200


def test_delete_topic_not_found(client, admin_user):
    response = client.delete('/api/admin/topics/nonexistent', headers=admin_user)
    assert response.status_code == 404


# ── Translations CRUD ────────────────────────────────────────────────────

def test_get_translations_empty(client, admin_user):
    response = client.get('/api/admin/translations', headers=admin_user)
    assert response.status_code == 200
    assert response.get_json()['translations'] == {}


def test_update_translations(client, admin_user):
    response = client.put('/api/admin/translations/en', headers=admin_user, json={
        'messages': {'common': {'appName': 'HamPrep'}},
    })
    assert response.status_code == 200
    assert response.get_json()['translation']['locale'] == 'en'


def test_update_translations_overwrite(client, admin_user):
    client.put('/api/admin/translations/cy', headers=admin_user, json={
        'messages': {'common': {'appName': 'HamPrep CY'}},
    })
    response = client.put('/api/admin/translations/cy', headers=admin_user, json={
        'messages': {'common': {'appName': 'HamPrep Cymraeg'}},
    })
    assert response.status_code == 200
    assert response.get_json()['translation']['messages']['common']['appName'] == 'HamPrep Cymraeg'


def test_get_translations_after_insert(client, admin_user):
    client.put('/api/admin/translations/en', headers=admin_user, json={
        'messages': {'common': {'appName': 'HamPrep'}},
    })
    response = client.get('/api/admin/translations', headers=admin_user)
    data = response.get_json()['translations']
    assert 'en' in data


def test_update_translations_no_data(client, admin_user):
    response = client.put('/api/admin/translations/en',
                          headers={**admin_user, 'Content-Type': 'application/json'},
                          data='')
    assert response.status_code == 400


def test_update_translations_missing_messages(client, admin_user):
    response = client.put('/api/admin/translations/en', headers=admin_user,
                          json={'locale': 'en'})
    assert response.status_code == 400
