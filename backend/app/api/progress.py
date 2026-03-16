from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.progress_service import (
    get_overall_progress,
    get_topic_breakdown,
    get_weak_areas,
    get_history,
)

progress_bp = Blueprint('progress', __name__, url_prefix='/api/progress')


@progress_bp.route('/', methods=['GET'])
@jwt_required()
def overall():
    user_id = get_jwt_identity()
    progress = get_overall_progress(user_id)
    return jsonify(progress), 200


@progress_bp.route('/topics', methods=['GET'])
@jwt_required()
def topics():
    user_id = get_jwt_identity()
    breakdown = get_topic_breakdown(user_id)
    return jsonify({'topics': breakdown}), 200


@progress_bp.route('/weak-areas', methods=['GET'])
@jwt_required()
def weak_areas():
    user_id = get_jwt_identity()
    areas = get_weak_areas(user_id)
    return jsonify({'weak_areas': areas}), 200


@progress_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    user_id = get_jwt_identity()
    records = get_history(user_id)
    return jsonify({'history': records}), 200
