from . import auth_bp
from flask import request, jsonify, session, redirect
from .forms import SignupForm
from ...models.user import Users
from flask_wtf.csrf import generate_csrf
from os import getenv

@auth_bp.route("/me")
def get_me() :
    response = jsonify(success=True, detail="get me status success")
    
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


@auth_bp.route("/logout", methods=["GET", "POST"])
def logout_user():
    """Logout route.

    Clears the Flask session. If the request includes an `atlassian` flag
    (query param or JSON body) the endpoint will redirect the user to
    Atlassian's logout URL so their Atlassian identity session is also
    terminated.

    Clients can call `/api/auth/logout?atlassian=1&continue=<url>` to clear
    server session and redirect to Atlassian logout which then continues to
    the provided URL (if supported).
    """
    # Clear server-side session/cookies
    session.clear()

    # Check for an Atlassian logout request
    atlassian_flag = None
    continue_url = None
    if request.method == "GET":
        atlassian_flag = request.args.get("atlassian")
        continue_url = request.args.get("continue")
    else:
        # POST - try JSON body safely
        try:
            body = request.get_json(silent=True) or {}
        except Exception:
            body = {}
        atlassian_flag = body.get("atlassian")
        continue_url = body.get("continue")

    # Normalize truthy values
    if isinstance(atlassian_flag, str):
        atlassian_flag = atlassian_flag.lower() in ("1", "true", "yes")

    if atlassian_flag:
        atlas_logout = getenv("ATLASSIAN_LOGOUT_URL") or "https://id.atlassian.com/logout"
        if continue_url:
            # Redirect to Atlassian logout with continue param
            return redirect(f"{atlas_logout}?continue={continue_url}")
        return redirect(atlas_logout)

    return jsonify(success=True, message="logged out")