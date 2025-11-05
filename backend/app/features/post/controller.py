from . import post_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from ...services import cloudinary
from ...models.post import Posts
from ...models.media import Media
from .forms import PostForm

@post_bp.route("", strict_slashes=False) 
@login_required
def get_posts() :
    limit = request.args.get("limit", default = 10, type=int)
    cursor_id = request.args.get("next_cursor", default=None, type=int)
    result = Posts.all(limit, cursor_id)
    feed = result
    has_more = len(feed) > limit
    feed = feed[:limit]


    return jsonify(
        feed=feed,
        next_cursor = feed[-1]['cursor_id'] if has_more else None,
    )
    
@post_bp.route("/<post_uuid>")
@login_required
def get_post(post_uuid) :
    post = Posts.get_post(post_uuid)
    return jsonify(
        post=post
    )

@post_bp.route("/", methods=["POST"])
@login_required
def create_post() :
    current_user_id = current_user.get_id()
    caption = request.form.get("caption")
    mediaList = request.files.getlist('media')
    print(mediaList)
    form = PostForm()
    validated = form.validate()
    current_user_id = current_user.get_id()
    error = {
        "caption" : form.caption.errors,
        "media" : form.media.errors,
        "root" : []
    }
    if validated : 
        try:
            new_post = Posts(caption=caption, user_id=current_user_id)
            res = new_post.add()
            new_post_id = res['id']
            new_post_uuid = res['uuid']

            for i, media in enumerate(mediaList) :
                if media.mimetype.startswith("image/") :
                    media_type = "image"
                elif media.mimetype.startswith("video/") :
                    media_type = "video"
                else :
                    raise ValueError("unsupported file type!")
                media_res = cloudinary.upload_asset(media, public_id=str(i), media_type=media_type, folder=f"posts/{new_post_uuid}")
                new_media = Media(media_url=media_res["srcURL"], media_order=i, media_type=media_type, post_id=new_post_id, width=media_res["width"], height=media_res["height"])
                new_media.add()
            new_post = Posts.get_post(new_post_uuid)
            return jsonify(success=True, post_uuid=new_post_uuid, new_post=new_post)
        except Exception as e:
            print(e)
            error["root"] = ["something went wrong creating a post"]
            return jsonify(success=False, error=error), 500
    return jsonify(success=False,
                    message="form fields might be invalid",
                    error=error), 400

@post_bp.route("/<uuid:post_uuid>", methods=["DELETE"])
@login_required
def delete_post(post_uuid) :
    post_uuid = str(post_uuid)
    current_user_id = current_user.get_id()
    to_delete_post_with_media = Posts.get_post(post_uuid)
    to_delete_post = Posts.delete(post_uuid, current_user_id)    
    
    if (to_delete_post) :
        if (len(to_delete_post_with_media["media"]) > 0) :
            try :
                cloudinary.delete_post(post_uuid)
            except : 
                return jsonify(success=False, message="delete post failed!"), 500
        return jsonify(success=True, message="delete post successful")        
    else :
        return jsonify(success=False, message="delete post failed!"), 404

@post_bp.route("/<uuid:post_uuid>", methods=["PUT"])
@login_required
def update_post(post_uuid) :
    post_uuid = str(post_uuid)
    # no need to validate since its only caption
    current_user_id = current_user.get_id()
    caption = request.form.get("caption")
    to_update_post = Posts.update(post_uuid, caption, current_user_id)
    if (to_update_post) :
        return jsonify(success=True, message="edit post successful", post_uuid=post_uuid)        
    else :
        return jsonify(success=False, message="edit post failed!"), 404

