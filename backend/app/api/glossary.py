from flask import Blueprint, jsonify

from app.utils.db import get_db

glossary_bp = Blueprint('glossary', __name__, url_prefix='/api/glossary')


@glossary_bp.route('/', methods=['GET'])
def list_glossary():
    db = get_db()
    terms = db.read('glossary')
    terms.sort(key=lambda t: t.get('term', '').lower())
    return jsonify({'glossary': terms}), 200
