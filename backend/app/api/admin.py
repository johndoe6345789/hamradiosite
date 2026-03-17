from flask import Blueprint, jsonify, request

from app.utils.decorators import admin_required
from app.services.admin_service import (
    list_users, get_user, update_user, delete_user,
    list_questions, get_question, create_question,
    update_question, delete_question,
    list_topics, get_topic, create_topic,
    update_topic, delete_topic,
    get_translations, update_translations,
)

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


# ── Users ────────────────────────────────────────────────────────────────

@admin_bp.route('/users', methods=['GET'])
@admin_required()
def users_list():
    return jsonify({'users': list_users()}), 200


@admin_bp.route('/users/<user_id>', methods=['GET'])
@admin_required()
def users_get(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user}), 200


@admin_bp.route('/users/<user_id>', methods=['PUT'])
@admin_required()
def users_update(user_id):
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    user, error = update_user(user_id, data)
    if error:
        return jsonify({'error': error}), 400
    return jsonify({'user': user}), 200


@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@admin_required()
def users_delete(user_id):
    deleted = delete_user(user_id)
    if not deleted:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'message': 'User deleted'}), 200


# ── Questions ────────────────────────────────────────────────────────────

@admin_bp.route('/questions', methods=['GET'])
@admin_required()
def questions_list():
    topic_slug = request.args.get('topic')
    return jsonify({'questions': list_questions(topic_slug)}), 200


@admin_bp.route('/questions/<question_id>', methods=['GET'])
@admin_required()
def questions_get(question_id):
    question = get_question(question_id)
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    return jsonify({'question': question}), 200


@admin_bp.route('/questions', methods=['POST'])
@admin_required()
def questions_create():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    required = ('text', 'options', 'correct_option_id', 'topic_slug')
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400
    question = create_question(data)
    return jsonify({'question': question}), 201


@admin_bp.route('/questions/<question_id>', methods=['PUT'])
@admin_required()
def questions_update(question_id):
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    question = update_question(question_id, data)
    if not question:
        return jsonify({'error': 'Question not found'}), 404
    return jsonify({'question': question}), 200


@admin_bp.route('/questions/<question_id>', methods=['DELETE'])
@admin_required()
def questions_delete(question_id):
    deleted = delete_question(question_id)
    if not deleted:
        return jsonify({'error': 'Question not found'}), 404
    return jsonify({'message': 'Question deleted'}), 200


# ── Topics ───────────────────────────────────────────────────────────────

@admin_bp.route('/topics', methods=['GET'])
@admin_required()
def topics_list():
    return jsonify({'topics': list_topics()}), 200


@admin_bp.route('/topics/<topic_id>', methods=['GET'])
@admin_required()
def topics_get(topic_id):
    topic = get_topic(topic_id)
    if not topic:
        return jsonify({'error': 'Topic not found'}), 404
    return jsonify({'topic': topic}), 200


@admin_bp.route('/topics', methods=['POST'])
@admin_required()
def topics_create():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    required = ('title', 'slug')
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400
    topic = create_topic(data)
    return jsonify({'topic': topic}), 201


@admin_bp.route('/topics/<topic_id>', methods=['PUT'])
@admin_required()
def topics_update(topic_id):
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    topic = update_topic(topic_id, data)
    if not topic:
        return jsonify({'error': 'Topic not found'}), 404
    return jsonify({'topic': topic}), 200


@admin_bp.route('/topics/<topic_id>', methods=['DELETE'])
@admin_required()
def topics_delete(topic_id):
    deleted = delete_topic(topic_id)
    if not deleted:
        return jsonify({'error': 'Topic not found'}), 404
    return jsonify({'message': 'Topic deleted'}), 200


# ── Translations ─────────────────────────────────────────────────────────

@admin_bp.route('/translations', methods=['GET'])
@admin_required()
def translations_list():
    return jsonify({'translations': get_translations()}), 200


@admin_bp.route('/translations/<locale>', methods=['PUT'])
@admin_required()
def translations_update(locale):
    data = request.get_json(silent=True)
    if not data or 'messages' not in data:
        return jsonify({'error': 'Messages data required'}), 400
    result = update_translations(locale, data['messages'])
    return jsonify({'translation': result}), 200
