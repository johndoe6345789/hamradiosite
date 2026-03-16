def test_list_topics(client):
    response = client.get('/api/topics/')
    assert response.status_code == 200
    data = response.get_json()
    topics = data['topics']
    assert len(topics) == 8
    assert topics[0]['title'] == 'Licensing Conditions'
    assert 'content' not in topics[0]


def test_get_topic_by_slug(client):
    response = client.get('/api/topics/technical-basics')
    assert response.status_code == 200
    topic = response.get_json()['topic']
    assert topic['title'] == 'Technical Basics'
    assert 'content' in topic
    assert 'Ohm' in topic['content']


def test_get_topic_not_found(client):
    response = client.get('/api/topics/nonexistent-topic')
    assert response.status_code == 404


def test_topics_ordered(client):
    response = client.get('/api/topics/')
    topics = response.get_json()['topics']
    orders = [t['order'] for t in topics]
    assert orders == sorted(orders)
