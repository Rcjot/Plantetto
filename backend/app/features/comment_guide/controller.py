from . import comment_guide_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from .forms import CommentGuideForm, EditCommentGuideForm
from ...models.comments_guides import CommentsGuides
from ...services import cloudinary
from datetime import date, timedelta

@comment_guide_bp.route("/", methods=["GET", "OPTIONS"], strict_slashes=False)
def get_comments(guide_uuid):  # ADD guide_uuid parameter
    if request.method == "OPTIONS":
        return jsonify(success=True), 200
    
    parent_uuid = request.args.get("parent_uuid", default=None, type=str)
    guide_uuid = str(guide_uuid)

    comments = CommentsGuides.all(guide_uuid, parent_uuid)

    return jsonify(success=True, comments=comments)

@comment_guide_bp.route("/", methods=["POST"], strict_slashes=False)
@login_required
def add_comment(guide_uuid):  # ADD guide_uuid parameter
    guide_uuid = str(guide_uuid)
    data = request.get_json()
    form = CommentGuideForm(data=data)
    form.guide_uuid.data = guide_uuid
    validated = form.validate()
    error = {
        "content":  form.content.errors,
        "guide_uuid": form.guide_uuid.errors,
        "parent_uuid" : form.parent_uuid.errors 
    }
    current_user_id = current_user.get_id()

    if validated : 
        new_comment = CommentsGuides(content=form.content.data, 
                                         guide_id=form.guide_id,
                                         user_id=current_user_id,
                                         parent_id=form.parent_id
                                         )
        uuid_res = new_comment.add()
        return jsonify(success=True, comment_uuid=uuid_res["uuid"])
    return jsonify(success=False,
                    message="form fields might be invalid",
                    error=error), 400

@comment_guide_bp.route("/<uuid:comment_uuid>", methods=["PATCH", "OPTIONS"], strict_slashes=False)  # ADDED OPTIONS
@login_required
def edit_comment(guide_uuid, comment_uuid):  # ADD guide_uuid parameter
    if request.method == "OPTIONS":
        return jsonify(success=True), 200
    
    comment_uuid = str(comment_uuid)
    data = request.get_json()
    form = EditCommentGuideForm(data=data)
    validated = form.validate()
    error = {
        "content":  form.content.errors,
    }
    current_user_id = current_user.get_id()

    if validated : 
        to_patch_comment = CommentsGuides.patch_content(comment_uuid, 
                                               form.content.data,
                                               current_user_id)
        if (to_patch_comment) :
            return jsonify(success=True, comment_uuid=comment_uuid)
        return jsonify(success=False, message="edit comment failed"), 404
    return jsonify(success=False,
                    message="form fields might be invalid",
                    error=error), 400

@comment_guide_bp.route("/<uuid:comment_uuid>", methods=["DELETE", "OPTIONS"], strict_slashes=False)  # ADDED OPTIONS
@login_required
def delete_comment(guide_uuid, comment_uuid):  # ADD guide_uuid parameter
    if request.method == "OPTIONS":
        return jsonify(success=True), 200
    
    comment_uuid = str(comment_uuid)
    current_user_id = current_user.get_id()
    to_delete_comment = CommentsGuides.delete_comment(comment_uuid, current_user_id)
    if to_delete_comment :
        return jsonify(success= True, message="delete comment successful")
    return jsonify(success=False, message="delete comment failed"), 404