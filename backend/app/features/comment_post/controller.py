from . import comment_post_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from .forms import CommentPostForm, EditCommentPostForm
from ...models.comments_posts import CommentsPosts

@comment_post_bp.route("/", methods=["GET"], strict_slashes=False)
def get_comments(post_uuid):
    parent_uuid = request.args.get("parent_uuid", default=None, type=str)
    post_uuid = str(post_uuid)

    comments = CommentsPosts.all(post_uuid, parent_uuid)


    return jsonify(success=True, comments=comments)


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