from . import bookmark_post_bp, bookmark_guide_bp
from flask import jsonify, request
from flask_login import login_required, current_user
from ...models.bookmarks import Bookmarks
from ...models.post import Posts
from ...models.guide import Guides


@bookmark_post_bp.route("/", methods=["POST"])
@login_required
def toggle_bookmark_post(post_uuid) :
    post_uuid = str(post_uuid)

    post_res = Posts.get_by_uuid(post_uuid)
    if post_res :
        post_id = post_res.id

        current_user_id = current_user.get_id()

        message = Bookmarks.toggle_bookmark_post(current_user_id, post_id)

        return jsonify(success=True, message=f"successfully {message} post", action=message)
    else :
        return jsonify(success=False, message=f"resource not found", action=None), 404


@bookmark_guide_bp.route("/", methods=["POST"])
@login_required
def toggle_bookmark_guide(guide_uuid) :
    guide_uuid = str(guide_uuid)

    guide_res = Guides.get_guide_id(guide_uuid)
    if guide_res :
        guide_id = guide_res['id']

        current_user_id = current_user.get_id()

        message = Bookmarks.toggle_bookmark_guide(current_user_id, guide_id)

        return jsonify(success=True, message=f"successfully {message} guide", action=message)
    else :
        return jsonify(success=False, message=f"resource not found", action=None), 404