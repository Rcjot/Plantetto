from flask import Flask,jsonify
from config import SECRET_KEY, DATABASE_URL
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, CSRFError

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
    
    @app.route("/") 
    def check_route():
        return jsonify(success=True)

    @app.errorhandler(CSRFError)
    def handle_csrf_error(e) :
        print(e.description)
        return jsonify(error="CSRF failed", message=e.description), 400
    
    return app
            
    