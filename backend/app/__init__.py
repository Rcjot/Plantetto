from flask import Flask,jsonify
from config import SECRET_KEY, DATABASE_URL
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, CSRFError
from . import database
from flask_login import LoginManager

login_manager = LoginManager()

def create_app() :
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=SECRET_KEY,
        DATABASE_URL=DATABASE_URL
    )

    cors = CORS(app,
                origins="*",
                supports_credentials=True,
                expose_headers="X-CSRFToken"
                )

    CSRFProtect(app)

    database.init_app(app)

    login_manager.init_app(app)
    
    @app.route("/") 
    def check_route():
        return jsonify(success=True)
    
    from .features.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="")

    from .features.user import user_bp
    app.register_blueprint(user_bp, url_prefix="/users")

    @app.errorhandler(CSRFError)
    def handle_csrf_error(e) :
        print(e.description)
        return jsonify(error="CSRF failed", message=e.description), 400

    @login_manager.user_loader
    def load_user(user_id) :
        from .models.user import Users
        return Users.get_by_id(user_id)
    
    return app
            
    