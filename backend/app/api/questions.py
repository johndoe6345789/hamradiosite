from flask import Blueprint, jsonify, request

from app.utils.db import get_db

questions_bp = Blueprint('questions', __name__, url_prefix='/api/questions')


@questions_bp.route('/', methods=['GET'])
def list_questions():
    db = get_db()
    questions = db.read('questions')

    topic_slug = request.args.get('topic')
    if topic_slug:
        topic = db.find_one('topics', lambda t: t['slug'] == topic_slug)
        if not topic:
            return jsonify({'error': 'Topic not found'}), 404
        questions = [q for q in questions if q.get('topic_slug') == topic_slug]

    limit = request.args.get('limit', type=int)
    if limit:
        questions = questions[:limit]

    return jsonify({'questions': questions}), 200
