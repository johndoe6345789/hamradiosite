def test_list_all_questions(client):
    response = client.get('/api/questions/')
    assert response.status_code == 200
    questions = response.get_json()['questions']
    assert len(questions) >= 120


def test_filter_questions_by_topic(client):
    response = client.get('/api/questions/?topic=safety')
    assert response.status_code == 200
    questions = response.get_json()['questions']
    assert len(questions) >= 15
    for q in questions:
        assert q['topic_slug'] == 'safety'


def test_filter_questions_nonexistent_topic(client):
    response = client.get('/api/questions/?topic=nonexistent')
    assert response.status_code == 404


def test_limit_questions(client):
    response = client.get('/api/questions/?limit=5')
    assert response.status_code == 200
    questions = response.get_json()['questions']
    assert len(questions) == 5
