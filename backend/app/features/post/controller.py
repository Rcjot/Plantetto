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
    feed = Posts.all()
    return jsonify(
        feed=feed
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