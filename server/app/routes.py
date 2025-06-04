from flask import Blueprint, jsonify
from .controller.user_controller import user_bp
from .controller.expense_controller import expense_bp

def register_routes(app):
    api = Blueprint('api', __name__)
    @api.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "ok"}), 200

    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(expense_bp, url_prefix='/api/expense')
