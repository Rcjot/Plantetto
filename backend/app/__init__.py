from flask import Flask, jsonify, send_from_directory
from config import SECRET_KEY, DATABASE_URL
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, CSRFError
from . import database
from flask_login import LoginManager
from .services import cleanup

login_manager = LoginManager()

def create_app() :
    app = Flask(__name__, 
                instance_relative_config=True, 
                static_folder="../../frontend/dist", 
                static_url_path="/")
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

    from .features.comment_post import comment_post_bp
    app.register_blueprint(comment_post_bp, url_prefix="/api/posts/<uuid:post_uuid>/comments")

    from .features.comment_guide import comment_guide_bp
    app.register_blueprint(comment_guide_bp, url_prefix="/api/guides/<uuid:guide_uuid>/comments")
    
    from .features.like import like_post_bp, like_guide_bp, like_comment_post_bp, like_comment_guide_bp
    app.register_blueprint(like_post_bp, url_prefix="/api/posts/<uuid:post_uuid>/likes")
    app.register_blueprint(like_guide_bp, url_prefix="/api/guides/<uuid:guide_uuid>/likes")
    app.register_blueprint(like_comment_post_bp, url_prefix="/api/posts/comments/<uuid:comment_uuid>/likes")
    app.register_blueprint(like_comment_guide_bp, url_prefix="/api/guides/comments/<uuid:comment_uuid>/likes")

    from .features.bookmark import bookmark_post_bp, bookmark_guide_bp, bookmark_list_bp
    app.register_blueprint(bookmark_post_bp, url_prefix="/api/posts/<uuid:post_uuid>/bookmarks")
    app.register_blueprint(bookmark_guide_bp, url_prefix="/api/guides/<uuid:guide_uuid>/bookmarks")
    app.register_blueprint(bookmark_list_bp, url_prefix="/api/bookmarks")


    @app.errorhandler(CSRFError)
    def handle_csrf_error(e) :
        print(e.description)
        return jsonify(error="CSRF failed", message=e.description), 400

    @login_manager.user_loader
    def load_user(user_id) :
        from .models.user import Users
        return Users.get_by_id(user_id)
    
    return app
            
    