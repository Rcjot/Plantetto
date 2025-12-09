from . import user_bp
from flask import request, jsonify
from flask_login import login_required, current_user
from ...services import cloudinary
from ...models.user import Users
from ...models.plant import Plants
from ...models.diary import Diaries
from ...models.guide import Guides
from ...models.post import Posts
from datetime import date
from .forms import ChangePasswordForm, ChangeEmailForm
from ...models.market import MarketItems
import math
import json

@user_bp.route("/upload", methods=["POST"])
@login_required
def set_image() :
    id = current_user.get_id()
    data = request.get_data()
    file = request.files['image']
    pfp_url = cloudinary.upload_pfp(file, id)

    if Users.set_pfp(id, pfp_url) :
        return jsonify(success=True, message="uploaded file")

    return jsonify(success=False, message="failed to upload file")

@user_bp.route("/<username>")
@login_required
def get_profile(username) :
    user = Users.get_by_username(username)
    if user :
        return jsonify(success=True, message="fetched profile", user=user.get_json())

    return jsonify(success=False, message="no profile", user=None), 400

@user_bp.route("/explore")
def explore_users():
    limit = request.args.get("limit", default=10, type=int)
    search = request.args.get("search", default="", type=str)
    cursor_timestamp = request.args.get("cursor", default=None, type=str)
    current_user_id = current_user.get_id()

    result = Users.explore(limit, search, cursor_timestamp, current_user_id)

    users = result 
    has_more = len(users) > limit
    users = users[:limit]

    return jsonify(
        users=users,
        next_cursor = users[-1]['created_at'] if has_more else None,
    )

@user_bp.route("/update", methods=["POST"])
@login_required
def update_profile():
    id = current_user.get_id()
    
    pfp_url = None
    if 'image' in request.files:
        file = request.files['image']
        pfp_url = cloudinary.upload_pfp(file, id)
    
    display_name = request.form.get('display_name')
    
    print("display_name from form:", display_name)
    print("files in request:", request.files)
    
    if display_name is None and pfp_url is None:
        return jsonify(success=False, message="no data to update"), 400
    
    if Users.update_profile(id, display_name=display_name, pfp_url=pfp_url):
        return jsonify(success=True, message="profile updated")
    
    return jsonify(success=False, message="failed to update profile"), 400

@user_bp.route("/<username>/plants")
def get_user_plants(username) :
    search = request.args.get("search", default="", type=str)
    plant_type_id = request.args.get("plant_type_id", default=None, type=int)
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default = 12, type=int)

    offset = (page - 1) * limit


    result = Plants.all(username, search, plant_type_id, limit, offset)
    plants = result["user_plants"]
    total_count = result["meta_data"]["total_count"]
    result_count = result["meta_data"]["result_count"]
    max_page = math.ceil(result_count / limit)
    meta_data = {
        "page" : page,
        "total_count" : total_count,
        "limit" : limit,
        "max_page" : max_page,
        "has_next" : page < max_page,
        "has_prev" : page > 1,
    }

    return jsonify(
        plants=plants,
        meta_data=meta_data,
    )

@user_bp.route("/<username>/plants_options") 
def get_user_plants_options(username) :
    result = Plants.get_plants_options(username)
    return jsonify(plant_options=result)

@user_bp.route("/<username>/diaries")
def get_user_diaries(username) :

    id_res = Users.get_id_uuid_by_username(username)

    # result = Diaries.get_all_on_date_of_user(id_res['id'], on_date,)
    result = Diaries.get_all_of_user_plants_with_diary_entry(id_res['id'])

    return jsonify(
        diaries=result
    )

@user_bp.route("/<username>/diaries/plants/<uuid:plant_uuid>")
def get_user_diaries_of_plant_on_date(username, plant_uuid) :
    plant_uuid = str(plant_uuid)
    plant_id_res = Plants.get_id_by_uuid(plant_uuid)

    on_date = request.args.get("date", default="today", type=str)

    id_res = Users.get_id_uuid_by_username(username)

    # result = Diaries.get_all_on_date_of_user(id_res['id'], on_date,)
    result = Diaries.get_all_on_date_of_user_of_plant(id_res['id'], plant_id_res['id'], on_date)

    return jsonify(
        diaries=result
    )


@user_bp.route("/<username>/diaries/plants/<uuid:plant_uuid>/dates")
def get_dates(username, plant_uuid) :
    plant_uuid = str(plant_uuid)
    plant_id_res = Plants.get_id_by_uuid(plant_uuid)


    id_res = Users.get_id_uuid_by_username(username)

    # result = Diaries.get_all_on_date_of_user(id_res['id'], on_date,)
    result = Diaries.get_all_dates_with_entry_of_plant(id_res['id'], plant_id_res['id'])

    return jsonify(
        dates=result
    )

@user_bp.route("/<username>/diaries/today")
def get_user_diaries_today(username) :
    result = Diaries.get_all_today_of_user(username)

    return jsonify(
        diaries=result
    )

@user_bp.route("/<username>/board")
def get_user_board(username) :
    status = request.args.get("status", default="all", type=str)
    sort = request.args.get("sort", default="recent", type=str)
    search = request.args.get("search", default="", type=str)
    plant_type_id = request.args.get("plant_type_id", default=None, type=int)
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default = 12, type=int)

    offset = (page - 1) * limit

    result = Guides.get_user_board(username, search, plant_type_id, limit, offset, sort, status)
    board = result["guides"]
    total_count = result["meta_data"]["total_count"]
    result_count = result["meta_data"]["result_count"]
    max_page = math.ceil(result_count / limit)
    meta_data = {
        "page" : page,
        "total_count" : total_count,
        "limit" : limit,
        "max_page" : max_page,
        "has_next" : page < max_page,
        "has_prev" : page > 1,
    }

    return jsonify(
        board=board,
        meta_data=meta_data
    )

@user_bp.route("/password", methods=["PATCH"]) 
@login_required
def change_password() :
    data = request.get_json()

    form = ChangePasswordForm(data=data)

    validated = form.validate()
    error = {
        "currentPassword" : form.currentPassword.errors,
        "newPassword" : form.newPassword.errors,
        "confirmNewPassword" : form.confirmNewPassword.errors,
        "root" : [],
    }

    current_user_id = current_user.get_id()

    if validated :
        user_json = current_user.get_json()
        username = user_json['username']
        user = Users.get_for_auth(username)

        if user and user.check_password(form.currentPassword.data) :
            if Users.change_password(current_user_id=current_user_id, new_password=form.newPassword.data) :
                return jsonify(success=True, message="successfully changed password")
            else :
                error["root"] = ["user not found"]
                return jsonify(success=False, 
                            message="resource not found",
                            error=error
                            ), 404
        error["currentPassword"] = ["invalid password"]
    
    return jsonify(success=False, 
                   message="might have invalid fields",
                   error=error
                   ), 400

@user_bp.route("/email", methods=["PATCH"]) 
@login_required
def change_email() :
    data = request.get_json()

    form = ChangeEmailForm(data=data)

    validated = form.validate()
    error = {
        "newEmail" : form.newEmail.errors,
        "root" : [],
    }

    current_user_id = current_user.get_id()

    if validated :
        if Users.change_email(current_user_id=current_user_id, new_email=form.newEmail.data) :
            return jsonify(success=True, message="successfully changed email")
        else :
            error["root"] = ["user not found"]
            return jsonify(success=False, 
                        message="resource not found",
                        error=error
                        ), 404

    return jsonify(success=False, 
                   message="might have invalid fields",
                   error=error
                   ), 400

@user_bp.route("/<username>/listing")
def get_user_listing(username) :
    status = request.args.get("status", default="all", type=str)
    sort = request.args.get("sort", default="recent", type=str)
    search = request.args.get("search", default="", type=str)
    plant_type_id = request.args.get("plant_type_id", default=None, type=int)
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default = 12, type=int)

    offset = (page - 1) * limit

    result = MarketItems.get_user_listing(username, search, status, sort, plant_type_id, limit, offset)
    listing = result["guides"]
    total_count = result["meta_data"]["total_count"]
    result_count = result["meta_data"]["result_count"]
    max_page = math.ceil(result_count / limit)
    meta_data = {
        "page" : page,
        "total_count" : total_count,
        "limit" : limit,
        "max_page" : max_page,
        "has_next" : page < max_page,
        "has_prev" : page > 1,
    }

    return jsonify(
        listing=listing,
        meta_data=meta_data
    )
    

@user_bp.route("/<username>/posts")
@login_required
def get_user_posts(username) :
    id_res = Users.get_id_uuid_by_username(username)
    if id_res is None :
        return jsonify(
                success=False,
                feed=[],
                next_cursor=None,
            ), 404

    limit = request.args.get("limit", default=10, type=int)
    cursor_data = request.args.get("cursor", default=None, type=str)
    
    cursor_score = None
    cursor_timestamp = None
    
    # Parse cursor if provided
    if cursor_data:
        try:
            cursor_obj = json.loads(cursor_data)
            cursor_score = cursor_obj.get("score")
            cursor_timestamp = cursor_obj.get("timestamp")
        except (json.JSONDecodeError, AttributeError):
            return jsonify(error="Invalid cursor format"), 400
    
    current_user_id = current_user.get_id()
    result = Posts.all(limit, cursor_score, cursor_timestamp, current_user_id, user_id=id_res['id'])
    
    feed = result
    has_more = len(feed) > limit
    feed = feed[:limit]
    
    # Create next cursor from last item
    next_cursor = None
    if has_more and feed:
        last_post = feed[-1]
        next_cursor = json.dumps({
            "score": last_post['priority_score'],
            "timestamp": last_post['created_at'].isoformat()
        })

    return jsonify(
        feed=feed,
        next_cursor=next_cursor,
    )
    
@user_bp.route("/verification_code", methods=["POST"])
def send_verify_code() :
    current_user_id = current_user.get_id()
    user = current_user.get_json()
    email = user['email']

    cooldown_minutes = 1

    if not Users.check_verification_status(current_user_id) and EmailVerifications.check_sent_code_request_is_available(current_user_id, cooldown_minutes) :

        token_res = EmailVerifications.generate_token(current_user_id)

        send_to_email(email, token_res['secret_code'], token_res['expires_in_minutes'])

        return jsonify(success=True, message="email sent")
    else :
        return jsonify(success=False, message="you are already verified or you are on cooldown"), 400

@user_bp.route("/verify_email", methods=["POST"])
def verify_email() :
    data = request.get_json()
    input_code = data['code']
    current_user_id = current_user.get_id()

    if EmailVerifications.verify_code(code=input_code, current_user_id=current_user_id) :
        return jsonify(success=True, verified=True)
    else : 
        return jsonify(success=False, verified=False), 400

@user_bp.route("/<username>/guides")
@login_required
def get_user_published_guides(username) :
    id_res = Users.get_id_uuid_by_username(username)
    if id_res is None :
        return jsonify(
                success=False,
                feed=[],
                next_cursor=None,
            ), 404
    
    search = request.args.get("search", default="", type=str)
    plant_type_id = request.args.get("plant_type_id", default=None, type=int)
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default = 12, type=int)

    offset = (page - 1) * limit
    current_user_id = current_user.get_id()

    result = Guides.get_published_guides(search, plant_type_id, limit, offset, current_user_id, id_res['id'])
    guides = result["guides"]
    total_count = result["meta_data"]["total_count"]
    result_count = result["meta_data"]["result_count"]
    max_page = math.ceil(result_count / limit)
    meta_data = {
        "page" : page,
        "total_count" : total_count,
        "limit" : limit,
        "max_page" : max_page,
        "has_next" : page < max_page,
        "has_prev" : page > 1,
    }

    return jsonify(
        guides=guides,
        meta_data=meta_data
    )