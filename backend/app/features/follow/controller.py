from . import follow_bp
from flask import jsonify, request
from flask_login import login_required, current_user
from ...models.follow import Follows
from ...models.user import Users

@follow_bp.route("/<username>", methods=["POST"])
@login_required
def follow_user(username):
    current_user_id = current_user.get_id()
    result = Follows.follow(current_user_id, username)
    
    if result:
        return jsonify(success=True, message="followed user successfully")
    return jsonify(success=False, message="failed to follow user"), 400

@follow_bp.route("/<username>", methods=["PATCH"])
@login_required
def toggle_notif(username):
    notif_type = request.args.get("notif_type", default="post", type=str)
    
    current_user_id = current_user.get_id()

    if (notif_type == "post") :
        Follows.patch_post_notif(current_user_id, username)
    elif (notif_type=="guide") :
        Follows.patch_guide_notif(current_user_id, username)
    
    return jsonify(success=True, message="toggled notif")

@follow_bp.route("/<username>", methods=["DELETE"])
@login_required
def unfollow_user(username):
    current_user_id = current_user.get_id()
    result = Follows.unfollow(current_user_id, username)
    
    if result:
        return jsonify(success=True, message="unfollowed user successfully")
    return jsonify(success=False, message="failed to unfollow user"), 400

@follow_bp.route("/<username>/status")
@login_required
def check_follow_status(username):
    current_user_id = current_user.get_id()
    is_following = Follows.is_following(current_user_id, username)
    
    return jsonify(success=True, is_following=is_following)

@follow_bp.route("/<username>/notifications")
@login_required
def get_notif_status(username):
    current_user_id = current_user.get_id()
    user_id_res = Users.get_id_uuid_by_username(username)
    following_id = user_id_res['id']
    notif_status = Follows.get_notification_status(current_user_id=current_user_id,
                                                   following_id=following_id)
    return jsonify(success=True, notif_status=notif_status)


@follow_bp.route("/<username>/counts")
@login_required
def get_follow_counts(username):
    counts = Follows.get_follow_counts(username)
    return jsonify(success=True, counts=counts)

@follow_bp.route("/<username>/followers")
@login_required
def get_followers(username):
    try:
        followers = Follows.get_followers(username)
        return jsonify(success=True, followers=followers)
    except Exception as e:
        print(f"Error in get_followers: {e}")
        return jsonify(success=False, message="Server error"), 500


@follow_bp.route("/<username>/following")
@login_required
def get_following(username):
    try:
        following = Follows.get_following(username)
        return jsonify(success=True, following=following)
    except Exception as e:
        print(f"Error in get_following: {e}")
        return jsonify(success=False, message="Server error"), 500