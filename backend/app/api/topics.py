from flask import Blueprint, jsonify

from app.utils.db import get_db

topics_bp = Blueprint('topics', __name__, url_prefix='/api/topics')


@topics_bp.route('/', methods=['GET'])
def list_topics():
    db = get_db()
    topics = db.read('topics')
    topics.sort(key=lambda t: t.get('order', 0))
    topic_list = []
    for t in topics:
        topic_list.append({
            'id': t['id'],
            'title': t['title'],
            'slug': t['slug'],
            'description': t['description'],
            'icon': t.get('icon', ''),
            'order': t.get('order', 0),
        })
    return jsonify({'topics': topic_list}), 200


@topics_bp.route('/<slug>', methods=['GET'])
def get_topic(slug):
    db = get_db()
    topic = db.find_one('topics', lambda t: t['slug'] == slug)
    if not topic:
        return jsonify({'error': 'Topic not found'}), 404
    return jsonify({'topic': topic}), 200
