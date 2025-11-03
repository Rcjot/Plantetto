from . import user_bp
from flask import request, jsonify
from flask_login import login_required, current_user
from ...services import cloudinary
from ...models.user import Users

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
    print("[DEBUG] Requested username:", username)
    user = Users.get_by_username(username)
    print("[DEBUG] User fetched:", user)
    print("[DEBUG] Current logged-in user:", current_user.get_id())
    if user :
        return jsonify(success=True, message="fetched profile", user=user.get_json())

    return jsonify(success=False, message="no profile", user=None), 400