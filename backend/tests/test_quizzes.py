def test_start_mock_exam(client, auth_headers):
    response = client.post('/api/quizzes/start',
                           json={'type': 'mock'},
                           headers=auth_headers)
    assert response.status_code == 201
    data = response.get_json()
    assert data['quiz_type'] == 'mock'
    assert data['total'] == 26
    assert data['time_limit'] == 3300
    assert len(data['questions']) == 26
    for q in data['questions']:
        assert 'correct_option_id' not in q
        assert 'explanation' not in q


def test_start_topic_quiz(client, auth_headers):
    response = client.post('/api/quizzes/start',
                           json={'type': 'topic', 'topic_slug': 'safety'},
                           headers=auth_headers)
    assert response.status_code == 201
    data = response.get_json()
    assert data['quiz_type'] == 'topic'
    assert data['total'] == 10
    assert data['time_limit'] is None


def test_start_topic_quiz_missing_slug(client, auth_headers):
    response = client.post('/api/quizzes/start',
                           json={'type': 'topic'},
                           headers=auth_headers)
    assert response.status_code == 400


def test_start_topic_quiz_invalid_topic(client, auth_headers):
    response = client.post('/api/quizzes/start',
                           json={'type': 'topic', 'topic_slug': 'nonexistent'},
                           headers=auth_headers)
    assert response.status_code == 400


def test_start_invalid_quiz_type(client, auth_headers):
    response = client.post('/api/quizzes/start',
                           json={'type': 'invalid'},
                           headers=auth_headers)
    assert response.status_code == 400


def test_start_quiz_unauthorized(client):
    response = client.post('/api/quizzes/start', json={'type': 'mock'})
    assert response.status_code == 401


def test_get_quiz(client, auth_headers):
    start = client.post('/api/quizzes/start',
                        json={'type': 'topic', 'topic_slug': 'safety'},
                        headers=auth_headers)
    quiz_id = start.get_json()['quiz_id']
    response = client.get(f'/api/quizzes/{quiz_id}', headers=auth_headers)
    assert response.status_code == 200
    assert response.get_json()['completed'] is False


def test_get_quiz_not_found(client, auth_headers):
    response = client.get('/api/quizzes/nonexistent', headers=auth_headers)
    assert response.status_code == 404


def test_submit_quiz(client, auth_headers):
    start = client.post('/api/quizzes/start',
                        json={'type': 'topic', 'topic_slug': 'safety'},
                        headers=auth_headers)
    quiz_id = start.get_json()['quiz_id']
    questions = start.get_json()['questions']
    answers = {q['id']: 'z' for q in questions}
    response = client.post(f'/api/quizzes/{quiz_id}/submit',
                           json={'answers': answers},
                           headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['score'] == 0
    assert data['passed'] is False


def test_submit_quiz_all_correct(client, auth_headers, db):
    start = client.post('/api/quizzes/start',
                        json={'type': 'topic', 'topic_slug': 'safety'},
                        headers=auth_headers)
    quiz_id = start.get_json()['quiz_id']
    question_ids = [q['id'] for q in start.get_json()['questions']]
    all_questions = db.read('questions')
    q_map = {q['id']: q for q in all_questions}
    answers = {qid: q_map[qid]['correct_option_id'] for qid in question_ids}
    response = client.post(f'/api/quizzes/{quiz_id}/submit',
                           json={'answers': answers},
                           headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['score'] == data['total']
    assert data['passed'] is True


def test_submit_quiz_already_submitted(client, auth_headers):
    start = client.post('/api/quizzes/start',
                        json={'type': 'topic', 'topic_slug': 'safety'},
                        headers=auth_headers)
    quiz_id = start.get_json()['quiz_id']
    client.post(f'/api/quizzes/{quiz_id}/submit',
                json={'answers': {}},
                headers=auth_headers)
    response = client.post(f'/api/quizzes/{quiz_id}/submit',
                           json={'answers': {}},
                           headers=auth_headers)
    assert response.status_code == 400
    assert 'already submitted' in response.get_json()['error']


def test_submit_quiz_not_found(client, auth_headers):
    response = client.post('/api/quizzes/nonexistent/submit',
                           json={'answers': {}},
                           headers=auth_headers)
    assert response.status_code == 400


def test_get_results(client, auth_headers):
    start = client.post('/api/quizzes/start',
                        json={'type': 'topic', 'topic_slug': 'safety'},
                        headers=auth_headers)
    quiz_id = start.get_json()['quiz_id']
    client.post(f'/api/quizzes/{quiz_id}/submit',
                json={'answers': {}},
                headers=auth_headers)
    response = client.get(f'/api/quizzes/{quiz_id}/results',
                          headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert 'quiz' in data
    assert 'results' in data
    for r in data['results']:
        assert 'correct_option_id' in r
        assert 'explanation' in r


def test_get_results_not_submitted(client, auth_headers):
    start = client.post('/api/quizzes/start',
                        json={'type': 'topic', 'topic_slug': 'safety'},
                        headers=auth_headers)
    quiz_id = start.get_json()['quiz_id']
    response = client.get(f'/api/quizzes/{quiz_id}/results',
                          headers=auth_headers)
    assert response.status_code == 404


def test_get_results_not_found(client, auth_headers):
    response = client.get('/api/quizzes/nonexistent/results',
                          headers=auth_headers)
    assert response.status_code == 404
