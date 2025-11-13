from . import user_bp
from flask import request, jsonify
from flask_login import login_required, current_user
from ...services import cloudinary
from ...models.user import Users
from ...models.plant import Plants
from ...models.diary import Diaries
from ...models.guide import Guides
from datetime import date
import math

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
    on_date = request.args.get("date", date.today().isoformat())
    result = Diaries.get_all_on_date_of_user(username, on_date)

    return jsonify(
        diaries=result
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
