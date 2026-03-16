import os
import json
import tempfile
import pytest
from unittest.mock import patch

from app import create_app
from app.config import config_by_name, BaseConfig, DevelopmentConfig, TestingConfig, ProductionConfig
from app.utils.db import init_db


def test_create_app_default_config():
    """Test create_app uses FLASK_ENV when no config_name given."""
    with tempfile.TemporaryDirectory() as tmpdir:
        os.environ["DATA_DIR"] = tmpdir
        with patch.dict(os.environ, {"FLASK_ENV": "testing"}):
            app = create_app()
            assert app.config["TESTING"] is True


def test_create_app_development():
    """Test create_app with development config."""
    with tempfile.TemporaryDirectory() as tmpdir:
        os.environ["DATA_DIR"] = tmpdir
        app = create_app("development")
        assert app.config["DEBUG"] is True


def test_create_app_production():
    """Test create_app with production config."""
    with tempfile.TemporaryDirectory() as tmpdir:
        os.environ["DATA_DIR"] = tmpdir
        app = create_app("production")
        assert app.config["DEBUG"] is not True


def test_config_data_dir():
    """Test DATA_DIR config."""
    assert hasattr(BaseConfig, "DATA_DIR")


def test_config_jwt_settings():
    """Test JWT settings exist."""
    assert BaseConfig.JWT_SECRET_KEY is not None
    assert BaseConfig.JWT_ACCESS_TOKEN_EXPIRES is not None
    assert BaseConfig.JWT_REFRESH_TOKEN_EXPIRES is not None


def test_development_config():
    """Test development config."""
    assert DevelopmentConfig.DEBUG is True


def test_testing_config():
    """Test testing config."""
    assert TestingConfig.TESTING is True
    assert TestingConfig.JWT_SECRET_KEY == "test-secret-key"


def test_production_config():
    """Test production config."""
    # ProductionConfig has no special attrs beyond base
    assert ProductionConfig.JWT_SECRET_KEY is not None


def test_config_by_name():
    """Test config_by_name mapping."""
    assert config_by_name["development"] is DevelopmentConfig
    assert config_by_name["testing"] is TestingConfig
    assert config_by_name["production"] is ProductionConfig


def test_seed_db_command(client, app):
    """Test the seed-db CLI command."""
    runner = app.test_cli_runner()
    result = runner.invoke(args=["seed-db"])
    assert "Seeded" in result.output
    assert "topics" in result.output
    assert "questions" in result.output


def test_me_invalid_user(client, app):
    """Test /api/auth/me with a nonexistent user ID."""
    from flask_jwt_extended import create_access_token
    with app.app_context():
        token = create_access_token(identity="nonexistent-uuid")
    response = client.get("/api/auth/me", headers={
        "Authorization": "Bearer " + token,
    })
    assert response.status_code == 404


def test_start_quiz_no_questions(client, auth_headers, db):
    """Test starting a topic quiz when no questions exist for the topic."""
    # Create a topic with no questions
    topics = db.read("topics")
    topics.append({
        "id": "999",
        "title": "Empty Topic",
        "slug": "empty-topic",
        "description": "No questions",
        "order": 99,
    })
    db.write("topics", topics)

    response = client.post("/api/quizzes/start",
                           json={"type": "topic", "topic_slug": "empty-topic"},
                           headers=auth_headers)
    assert response.status_code == 400
    assert "No questions" in response.get_json()["error"]
