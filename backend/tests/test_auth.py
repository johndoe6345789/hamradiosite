def test_register_success(client):
    response = client.post('/api/auth/register', json={
        'username': 'newuser',
        'email': 'new@example.com',
        'password': 'password123',
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data['user']['username'] == 'newuser'
    assert data['user']['email'] == 'new@example.com'
    assert 'access_token' in data
    assert 'refresh_token' in data
    assert 'password_hash' not in data['user']


def test_register_duplicate_email(client, sample_user):
    response = client.post('/api/auth/register', json={
        'username': 'anotheruser',
        'email': 'test@example.com',
        'password': 'password123',
    })
    assert response.status_code == 409


def test_register_duplicate_username(client, sample_user):
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'another@example.com',
        'password': 'password123',
    })
    assert response.status_code == 409


def test_register_invalid_email(client):
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'notanemail',
        'password': 'password123',
    })
    assert response.status_code == 400


def test_register_short_username(client):
    response = client.post('/api/auth/register', json={
        'username': 'ab',
        'email': 'test@example.com',
        'password': 'password123',
    })
    assert response.status_code == 400


def test_register_short_password(client):
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': '12345',
    })
    assert response.status_code == 400


def test_register_no_data(client):
    response = client.post('/api/auth/register',
                           data='',
                           content_type='application/json')
    assert response.status_code == 400


def test_login_success(client, sample_user):
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123',
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data['user']['email'] == 'test@example.com'
    assert 'access_token' in data


def test_login_wrong_password(client, sample_user):
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'wrongpassword',
    })
    assert response.status_code == 401


def test_login_nonexistent_user(client):
    response = client.post('/api/auth/login', json={
        'email': 'nonexistent@example.com',
        'password': 'password123',
    })
    assert response.status_code == 401


def test_login_invalid_data(client):
    response = client.post('/api/auth/login', json={
        'email': 'notanemail',
        'password': '',
    })
    assert response.status_code == 400


def test_login_no_data(client):
    response = client.post('/api/auth/login',
                           data='',
                           content_type='application/json')
    assert response.status_code == 400


def test_refresh_token(client, sample_user):
    response = client.post('/api/auth/refresh', headers={
        'Authorization': f'Bearer {sample_user["refresh_token"]}',
    })
    assert response.status_code == 200
    assert 'access_token' in response.get_json()


def test_logout(client, auth_headers):
    response = client.post('/api/auth/logout', headers=auth_headers)
    assert response.status_code == 200


def test_me(client, auth_headers):
    response = client.get('/api/auth/me', headers=auth_headers)
    assert response.status_code == 200
    assert response.get_json()['user']['email'] == 'test@example.com'


def test_me_unauthorized(client):
    response = client.get('/api/auth/me')
    assert response.status_code == 401
