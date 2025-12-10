from . import comment_post_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from .forms import CommentPostForm, EditCommentPostForm
from ...models.comments_posts import CommentsPosts
from ...models.notifications import Notifications
from ...models.post import Posts
from ...sockets import notify_post_author
import json

@comment_post_bp.route("/", methods=["GET"], strict_slashes=False)
def get_comments(post_uuid):
    limit = request.args.get("limit", default=10, type=int)
    cursor_timestamp = request.args.get("cursor", default=None, type=str)
    if cursor_timestamp == "null" :
        cursor_timestamp = None
    parent_uuid = request.args.get("parent_uuid", default=None, type=str)
    post_uuid = str(post_uuid)

    current_user_id = current_user.get_id()

    comments = CommentsPosts.all(post_uuid, parent_uuid, current_user_id, cursor_timestamp, limit)

    has_more = len(comments) > limit
    comments = comments[:limit]

    total_count = CommentsPosts.get_count_of_post(post_uuid)


    return jsonify(success=True, 
                   comments=comments,
                   total_count=total_count['count'],
                   next_cursor = comments[-1]['created_at'] if has_more else None,
                   )


@comment_post_bp.route("/", methods=["POST"], strict_slashes=False)
@login_required
def add_comment(post_uuid):
    post_uuid = str(post_uuid)
    data = request.get_json()
    form = CommentPostForm(data=data)
    form.post_uuid.data = post_uuid
    
    if form.validate():
        current_user_id = current_user.get_id()
        new_comment = CommentsPosts(
            content=form.content.data, 
            post_id=form.post_id,
            user_id=current_user_id,
            parent_id=form.parent_id
        )

        uuid_res = new_comment.add()

        author_id_uuid_res = Posts.get_post_author_id_uuid(post_uuid)

        if (str(author_id_uuid_res['id']) != str(current_user_id)) :
            actor = current_user.get_json()
            payload = Notifications.generate_notification_comment(entity_id=form.post_id,
                                                        content=form.content.data,
                                                        actor=actor,
                                                        entity_uuid=post_uuid,
                                                        actor_id=current_user_id,
                                                        user_id=author_id_uuid_res['id'],
                                                        notification_type="comment_post"
                                                        )

            notify_post_author(author_id_uuid_res['uuid'], new_notif_payload=payload)
        

        return jsonify(success=True, comment_uuid=uuid_res["uuid"])
        
    return jsonify(success=False, message="form fields might be invalid", error=form.errors), 400

@comment_post_bp.route("/<uuid:comment_uuid>", methods=["PATCH"], strict_slashes=False)
@login_required
def edit_comment(post_uuid, comment_uuid):
    comment_uuid = str(comment_uuid)
    data = request.get_json()
    form = EditCommentPostForm(data=data)
    
    if form.validate():
        current_user_id = current_user.get_id()
        to_patch_comment = CommentsPosts.patch_content(
            comment_uuid, 
            form.content.data,
            current_user_id
        )
        if to_patch_comment:
            return jsonify(success=True, comment_uuid=comment_uuid)
        return jsonify(success=False, message="edit comment failed"), 404
        
    return jsonify(success=False, message="form fields might be invalid", error=form.errors), 400

@comment_post_bp.route("/<uuid:comment_uuid>", methods=["DELETE"], strict_slashes=False)
@login_required
def delete_comment(post_uuid, comment_uuid):
    comment_uuid = str(comment_uuid)
    current_user_id = current_user.get_id()
    
    to_delete_comment = CommentsPosts.delete_comment(comment_uuid, current_user_id)
    
    if to_delete_comment:
        return jsonify(success=True, message="delete comment successful")
    return jsonify(success=False, message="delete comment failed"), 404