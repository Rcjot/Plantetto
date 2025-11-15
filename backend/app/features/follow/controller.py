from . import follow_bp
from flask import jsonify
from flask_login import login_required, current_user
from ...models.follow import Follows

@follow_bp.route("/<username>", methods=["POST"])
@login_required
def follow_user(username):
    current_user_id = current_user.get_id()
    result = Follows.follow(current_user_id, username)
    
    if result:
        return jsonify(success=True, message="followed user successfully")
    return jsonify(success=False, message="failed to follow user"), 400

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

@follow_bp.route("/<username>/counts")
@login_required
def get_follow_counts(username):
    counts = Follows.get_follow_counts(username)
    return jsonify(success=True, counts=counts)