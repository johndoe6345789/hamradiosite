import os
import json
import pytest
import tempfile

from app import create_app
from app.utils.db import init_db


@pytest.fixture
def app():
    """Create a test Flask application with a temporary data directory."""
    with tempfile.TemporaryDirectory() as tmpdir:
        os.environ['DATA_DIR'] = tmpdir

        test_app = create_app('testing')
        test_app.config['DATA_DIR'] = tmpdir

        with test_app.app_context():
            database = init_db(test_app)
            _seed_test_data(database)

        yield test_app


@pytest.fixture
def client(app):
    """Flask test client."""
    return app.test_client()


@pytest.fixture
def db(app):
    """Get database instance."""
    from app.utils.db import get_db
    with app.app_context():
        return get_db()


@pytest.fixture
def sample_user(client):
    """Create and return a sample user."""
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123',
    })
    return response.get_json()


@pytest.fixture
def auth_headers(sample_user):
    """Return auth headers with a valid JWT token."""
    return {
        'Authorization': f'Bearer {sample_user["access_token"]}',
        'Content-Type': 'application/json',
    }


def _seed_test_data(database):
    """Seed the test database with topics and questions."""
    seeds_dir = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), 'seeds', 'data'
    )

    topics_path = os.path.join(seeds_dir, 'topics.json')
    with open(topics_path, 'r', encoding='utf-8') as f:
        topics = json.load(f)
    for i, topic in enumerate(topics):
        topic['id'] = str(i + 1)
    database.write('topics', topics)

    questions_path = os.path.join(seeds_dir, 'questions.json')
    with open(questions_path, 'r', encoding='utf-8') as f:
        questions_data = json.load(f)

    all_questions = []
    topic_map = {t['slug']: t['id'] for t in topics}
    q_id = 1
    for topic_group in questions_data:
        topic_slug = topic_group['topic_slug']
        topic_id = topic_map.get(topic_slug)
        for q in topic_group['questions']:
            q['id'] = str(q_id)
            q['topic_id'] = topic_id
            q['topic_slug'] = topic_slug
            all_questions.append(q)
            q_id += 1

    database.write('questions', all_questions)
