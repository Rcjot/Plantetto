from flask import Flask, jsonify, send_from_directory
from config import SECRET_KEY, DATABASE_URL
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, CSRFError
from . import database
from flask_login import LoginManager
from .services import cleanup
from flask_socketio import SocketIO, send

login_manager = LoginManager()
socketio = SocketIO(cors_allowed_origins="*")

def create_app() :
    app = Flask(__name__, 
                instance_relative_config=True, 
                static_folder="../../frontend/dist", 
                static_url_path="/")
    app.config.from_mapping(
        SECRET_KEY=SECRET_KEY,
        DATABASE_URL=DATABASE_URL
    )

    socketio.init_app(app)

    from . import sockets


    cors = CORS(app,
                origins="*",
                supports_credentials=True,
                expose_headers="X-CSRFToken"
                )

    CSRFProtect(app)

    database.init_app(app)

    login_manager.init_app(app)

    cleanup.cleanup_unused_guides_images(app)
    cleanup.init_app(app)

    @app.route("/") 
    def server():
        return send_from_directory(app.static_folder, "index.html")
        
    @app.errorhandler(404)
    def not_found(e) :
        return send_from_directory(app.static_folder, "index.html")

    
    from .features.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api")

    from .features.user import user_bp
    app.register_blueprint(user_bp, url_prefix="/api/users")

    from .features.plant import plant_bp
    app.register_blueprint(plant_bp, url_prefix="/api/plants")

    from .features.post import post_bp
    app.register_blueprint(post_bp, url_prefix="/api/posts")

    from .features.diary import diary_bp
    app.register_blueprint(diary_bp, url_prefix="/api/diaries")

    from .features.guide import guide_bp
    app.register_blueprint(guide_bp, url_prefix="/api/guides")

    from .features.follow import follow_bp
    app.register_blueprint(follow_bp, url_prefix="/api/follow")

    from .features.chat import chat_bp
    app.register_blueprint(chat_bp, url_prefix="/api/chat")

    from .features.notification import notification_bp
    app.register_blueprint(notification_bp, url_prefix="/api/notifications")

    @app.errorhandler(CSRFError)
    def handle_csrf_error(e) :
        print(e.description)
        return jsonify(error="CSRF failed", message=e.description), 400

    @login_manager.user_loader
    def load_user(user_id) :
        from .models.user import Users
        return Users.get_by_id(user_id)
    
    return app
            
    
