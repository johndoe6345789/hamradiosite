import os
import json
import click
from flask import Flask, jsonify

from app.config import config_by_name
from app.extensions import jwt, cors
from app.utils.db import init_db


def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.config.from_object(config_by_name[config_name])

    jwt.init_app(app)
    cors.init_app(app)

    database = init_db(app)

    from app.api.auth import auth_bp
    from app.api.topics import topics_bp
    from app.api.questions import questions_bp
    from app.api.quizzes import quizzes_bp
    from app.api.progress import progress_bp
    from app.api.admin import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(topics_bp)
    app.register_blueprint(questions_bp)
    app.register_blueprint(quizzes_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(admin_bp)

    @app.route("/api/health")
    def health():
        return jsonify({"status": "healthy"})

    @app.cli.command("seed-db")
    def seed_db():
        """Seed the database with topics and questions from JSON files."""
        seeds_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "seeds", "data"
        )

        topics_path = os.path.join(seeds_dir, "topics.json")
        with open(topics_path, "r", encoding="utf-8") as f:
            topics = json.load(f)
        for i, topic in enumerate(topics):
            topic["id"] = str(i + 1)
        database.write("topics", topics)
        click.echo("Seeded " + str(len(topics)) + " topics.")

        questions_path = os.path.join(seeds_dir, "questions.json")
        with open(questions_path, "r", encoding="utf-8") as f:
            questions_data = json.load(f)

        all_questions = []
        topic_map = {t["slug"]: t["id"] for t in topics}
        q_id = 1
        for topic_group in questions_data:
            topic_slug = topic_group["topic_slug"]
            topic_id = topic_map.get(topic_slug)
            for q in topic_group["questions"]:
                q["id"] = str(q_id)
                q["topic_id"] = topic_id
                q["topic_slug"] = topic_slug
                all_questions.append(q)
                q_id += 1

        database.write("questions", all_questions)
        click.echo("Seeded " + str(len(all_questions)) + " questions.")

    return app
