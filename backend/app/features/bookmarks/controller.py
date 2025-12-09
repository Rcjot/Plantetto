from . import bookmark_post_bp, bookmark_guide_bp, bookmark_list_bp
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
        current_user_id = current_user.get_id()
        message = Bookmarks.toggle_bookmark_post(current_user_id, post_res.id)
        return jsonify(success=True, message=f"successfully {message} post", action=message)
    else :
        return jsonify(success=False, message=f"resource not found", action=None), 404

@bookmark_guide_bp.route("/", methods=["POST"])
@login_required
def toggle_bookmark_guide(guide_uuid) :
    guide_uuid = str(guide_uuid)
    guide_res = Guides.get_guide_id(guide_uuid)
    if guide_res :
        current_user_id = current_user.get_id()
        message = Bookmarks.toggle_bookmark_guide(current_user_id, guide_res['id'])
        return jsonify(success=True, message=f"successfully {message} guide", action=message)
    else :
        return jsonify(success=False, message=f"resource not found", action=None), 404

@bookmark_list_bp.route("/posts", methods=["GET"])
@login_required
def get_bookmarked_posts():
    limit = request.args.get("limit", default=10, type=int)
    # Cursor is a float because it's an epoch timestamp
    cursor_timestamp = request.args.get("next_cursor", default=None, type=float)
    
    current_user_id = current_user.get_id()
    
    result = Posts.get_bookmarked_post(current_user_id, limit, cursor_timestamp)
    
    feed = result
    has_more = len(feed) > limit
    feed = feed[:limit]
    
    return jsonify(
        feed=feed,
        next_cursor=feed[-1]['cursor_id'] if has_more else None
    )

@bookmark_list_bp.route("/guides", methods=["GET"])
@login_required
def get_bookmarked_guides():
    limit = request.args.get("limit", default=12, type=int)
    page = request.args.get("page", default=1, type=int)
    offset = (page - 1) * limit

    current_user_id = current_user.get_id()
    
    guides = Guides.get_bookmarked_guide(current_user_id, limit, offset)

    return jsonify(guides=guides)