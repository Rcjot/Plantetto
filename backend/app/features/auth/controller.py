from . import auth_bp
from flask import request, jsonify
from .forms import SignupForm
from ...models.user import Users
from flask_wtf.csrf import generate_csrf

@auth_bp.route("/me")
def get_me() :
    response = jsonify(success=True, detail="get me status success")
    response.headers.set("X-CSRFToken", generate_csrf())
    return response

@auth_bp.route("/signup", methods=["POST"])
def signup_user() :
    data = request.get_json()

    form = SignupForm(data=data)
    validated = form.validate()
    error = {
        "username" : form.username.errors,
        "email" : form.email.errors,
        "password" : form.password.errors,
        "confirm" : form.confirm.errors
    }

    if validated :
        new_user = Users(username=form.username.data, 
                         email=form.email.data, 
                         password=form.password.data)
        new_user.add()

        return jsonify(success=True, message="signup success")
    
    return jsonify(success=False, 
                   message="something went wrong on signup",
                   error=error
                   )

