from . import user_bp
from flask import request, jsonify
from flask_login import login_required, current_user
from ...services import cloudinary
from ...models.user import Users
from ...models.plant import Plants

@user_bp.route("/upload", methods=["POST"])
@login_required
def set_image() :
    id = current_user.get_id()
    data = request.get_data()
    file = request.files['image']
    print(file.filename, file.content_type)
    # file.save(f"./uploads/{file.filename}")
    pfp_url = cloudinary.upload_pfp(file, id)

    if Users.set_pfp(id, pfp_url) :
        print(data)
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
    plants = Plants.all(username)
    return jsonify(
        plants=plants
    )