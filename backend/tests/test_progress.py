def test_overall_progress_empty(client, auth_headers):
    response = client.get('/api/progress/', headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['total_quizzes'] == 0
    assert data['overall_percentage'] == 0.0


def test_overall_progress_with_data(client, auth_headers):
    start = client.post('/api/quizzes/start',
                        json={'type': 'topic', 'topic_slug': 'safety'},
                        headers=auth_headers)
    quiz_id = start.get_json()['quiz_id']
    client.post(f'/api/quizzes/{quiz_id}/submit',
                json={'answers': {}},
                headers=auth_headers)
    response = client.get('/api/progress/', headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['total_quizzes'] == 1


def test_topic_breakdown(client, auth_headers):
    response = client.get('/api/progress/topics', headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['topics']) == 8


def test_topic_breakdown_with_data(client, auth_headers):
    start = client.post('/api/quizzes/start',
                        json={'type': 'topic', 'topic_slug': 'safety'},
                        headers=auth_headers)
    quiz_id = start.get_json()['quiz_id']
    client.post(f'/api/quizzes/{quiz_id}/submit',
                json={'answers': {}},
                headers=auth_headers)
    response = client.get('/api/progress/topics', headers=auth_headers)
    topics = response.get_json()['topics']
    safety = next(t for t in topics if t['topic_slug'] == 'safety')
    assert safety['quizzes_taken'] == 1


def test_weak_areas(client, auth_headers):
    response = client.get('/api/progress/weak-areas', headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data['weak_areas'], list)


def test_weak_areas_with_data(client, auth_headers):
    start = client.post('/api/quizzes/start',
                        json={'type': 'topic', 'topic_slug': 'safety'},
                        headers=auth_headers)
    quiz_id = start.get_json()['quiz_id']
    client.post(f'/api/quizzes/{quiz_id}/submit',
                json={'answers': {}},
                headers=auth_headers)
    response = client.get('/api/progress/weak-areas', headers=auth_headers)
    data = response.get_json()
    assert len(data['weak_areas']) >= 1


def test_history_empty(client, auth_headers):
    response = client.get('/api/progress/history', headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['history'] == []


def test_history_with_data(client, auth_headers):
    start = client.post('/api/quizzes/start',
                        json={'type': 'topic', 'topic_slug': 'safety'},
                        headers=auth_headers)
    quiz_id = start.get_json()['quiz_id']
    client.post(f'/api/quizzes/{quiz_id}/submit',
                json={'answers': {}},
                headers=auth_headers)
    response = client.get('/api/progress/history', headers=auth_headers)
    data = response.get_json()
    assert len(data['history']) == 1
    assert data['history'][0]['quiz_type'] == 'topic'


def test_progress_unauthorized(client):
    response = client.get('/api/progress/')
    assert response.status_code == 401
