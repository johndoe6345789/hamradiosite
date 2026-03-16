from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.quiz_service import start_quiz, get_quiz, submit_quiz, get_quiz_results

quizzes_bp = Blueprint('quizzes', __name__, url_prefix='/api/quizzes')


@quizzes_bp.route('/start', methods=['POST'])
@jwt_required()
def start():
    user_id = get_jwt_identity()
    data = request.get_json()
    quiz_type = data.get('type', 'mock')
    topic_slug = data.get('topic_slug')

    result, error = start_quiz(user_id, quiz_type, topic_slug)
    if error:
        return jsonify({'error': error}), 400

    return jsonify(result), 201


@quizzes_bp.route('/<quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz_endpoint(quiz_id):
    user_id = get_jwt_identity()
    result = get_quiz(quiz_id, user_id)
    if not result:
        return jsonify({'error': 'Quiz not found'}), 404
    return jsonify(result), 200


@quizzes_bp.route('/<quiz_id>/submit', methods=['POST'])
@jwt_required()
def submit(quiz_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    answers = data.get('answers', {})

    result, error = submit_quiz(quiz_id, user_id, answers)
    if error:
        return jsonify({'error': error}), 400

    return jsonify(result), 200


@quizzes_bp.route('/<quiz_id>/results', methods=['GET'])
@jwt_required()
def results(quiz_id):
    user_id = get_jwt_identity()
    result = get_quiz_results(quiz_id, user_id)
    if not result:
        return jsonify({'error': 'Results not available'}), 404
    return jsonify(result), 200
