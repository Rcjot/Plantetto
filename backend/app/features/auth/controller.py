from . import auth_bp
from flask import request, jsonify
from .forms import SignupForm, LoginForm
from ...models.user import Users
from flask_wtf.csrf import generate_csrf
from flask_login import login_user, login_required, current_user, logout_user

@auth_bp.route("/me")
def get_me() :
    if current_user.is_authenticated: 
        status = "authenticated"
        user = current_user.get_json()
    else : 
        status = "unauthenticated"
        user = None

    response = jsonify(success=True, 
                        detail="get me status success", 
                        status=status,
                        user=user)
    
    response.set_cookie(
        "XSRF-TOKEN",
        generate_csrf(),
        secure=False,
        httponly=False,
        samesite="Lax",
        path="/"
    )
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
                   ), 400

@auth_bp.route("/signin", methods=["POST"])
def signin_user() :
    data = request.get_json()

    form = LoginForm(data=data)
    validated = form.validate()
    error = {
        "username" : form.username.errors,
        "password" : form.password.errors,
        "root" : [],
    }

    if validated :
        user = Users.get_for_auth(form.username.data)

        if user and user.check_password(form.password.data) :
            login_user(user, remember=form.remember.data)
            print("hi successful", user.get_json())
            return jsonify(success=True, message="signin success", user=user.get_json())
        
        error["root"] = ["invalid username or password"]

    return jsonify(success=False,message="invalid credentials", error=error), 400

@auth_bp.route("/protected")
@login_required
def get_protected() :
    return jsonify(success=True, message="accessed protected", user=current_user.get_json())

@auth_bp.route("/logout")
def logout() :
    logout_user()
    return jsonify(success=True, message="logout successful")