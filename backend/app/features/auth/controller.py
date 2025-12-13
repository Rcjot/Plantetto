from . import auth_bp
from flask import request, jsonify
from .forms import SignupForm, LoginForm
from ...models.user import Users
from ...models.email_verification import EmailVerifications
from flask_wtf.csrf import generate_csrf
from flask_login import login_user, login_required, current_user, logout_user
from ...services.resend import send_to_email

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
        has_available_code =  EmailVerifications.check_code_signup_email_available(form.email.data)
        # checking here includes clean up of expired codes

        if (has_available_code) :
            # do not do anything
            return jsonify(success=False, 
                           has_available_code=has_available_code,
                           sent=False,
                            message="already pending a verification code to the email. Previous form submission did not save.")
        else :
            token_res = EmailVerifications.generate_code_signup_email(form.email.data, form.username.data, form.password.data)

            send_to_email(form.email.data, token_res['secret_code'], token_res['expires_in_minutes'])
            return jsonify(success=True,
                           has_available_code=has_available_code,
                            sent=True, 
                            message="sent a verification code to email")

    return jsonify(success=False, 
                has_available_code=None,
                sent=False,
                message="something went wrong on signup",
                error=error
                ), 400


@auth_bp.route("/verify_signup", methods=["POST"])
def verify_signup_user() :
    
    data = request.get_json()
    code = data["code"]
    email = data["email"]

    
    if EmailVerifications.verify_signup_email_and_create_user(code, email) :
        return jsonify(success=True, message="verified signup successful")
    else :
        return jsonify(success=False, message="verified signup failed")

# in the case where we would add resend ednpoint
        # just update the signup_email_verifications, naming is bad should include codes

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
            login_user(user, remember=True)
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