from . import post_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from ...services import cloudinary
from ...models.post import Posts
from ...models.media import Media
from ...models.planttag import PlantTags
from .forms import PostForm
import json

@post_bp.route("", strict_slashes=False) 
@login_required
def get_posts():
    limit = request.args.get("limit", default=10, type=int)
    cursor_data = request.args.get("cursor", default=None, type=str)
    
    cursor_score = None
    cursor_timestamp = None
    
    if cursor_data:
        try:
            cursor_obj = json.loads(cursor_data)
            cursor_score = cursor_obj.get("score")
            cursor_timestamp = cursor_obj.get("timestamp")
        except (json.JSONDecodeError, AttributeError):
            return jsonify(error="Invalid cursor format"), 400
    
    current_user_id = current_user.get_id()
    result = Posts.all(limit, cursor_score, cursor_timestamp, current_user_id)
    
    feed = result
    has_more = len(feed) > limit
    feed = feed[:limit]
    
    next_cursor = None
    if has_more and feed:
        last_post = feed[-1]
        next_cursor = json.dumps({
            "score": last_post['priority_score'],
            "timestamp": last_post['created_at'].isoformat()
        })

    return jsonify(
        feed=feed,
        next_cursor=next_cursor,
    )
    
@post_bp.route("/<post_uuid>")
@login_required
def get_post(post_uuid):
    post = Posts.get_post(post_uuid)
    return jsonify(
        post=post
    )

@post_bp.route("/", methods=["POST"])
@login_required
def create_post():
    current_user_id = current_user.get_id()
    caption = request.form.get("caption")
    visibility = request.form.get("visibility", "everyone")
    mediaList = request.files.getlist('media')
    form = PostForm()
    current_user_id = current_user.get_id()
    form.current_user_id = current_user_id

    validated = form.validate()
    error = {
        "caption" : form.caption.errors,
        "media" : form.media.errors,
        "planttags" : form.planttags.errors,
        "root" : []
    }
    if validated: 
        try:
            new_post = Posts(caption=caption, visibility=visibility, user_id=current_user_id)
            res = new_post.add()
            new_post_id = res['id']
            new_post_uuid = res['uuid']

            for i, media in enumerate(mediaList):
                if media.mimetype.startswith("image/"):
                    media_type = "image"
                elif media.mimetype.startswith("video/"):
                    media_type = "video"
                else:
                    raise ValueError("unsupported file type!")
                media_res = cloudinary.upload_asset(media, public_id=str(i), media_type=media_type, folder=f"posts/{new_post_uuid}")
                new_media = Media(media_url=media_res["srcURL"], media_order=i, media_type=media_type, post_id=new_post_id, width=media_res["width"], height=media_res["height"])
                new_media.add()
            new_post = Posts.get_post(new_post_uuid)

            for tag in form.parsed_planttags :
                new_planttag = PlantTags(plant_id=tag['id'], post_id=new_post_id)
                new_planttag.add()
  
            new_post['planttags'] = form.parsed_planttags
            return jsonify(success=True,
                           post_uuid=new_post_uuid,
                           new_post=new_post,
                           )
        except Exception as e:
            print(e)
            error["root"] = ["something went wrong creating a post"]
            return jsonify(success=False, error=error), 500
    return jsonify(success=False,
                    message="form fields might be invalid",
                    error=error), 400

@post_bp.route("/<uuid:post_uuid>", methods=["DELETE"])
@login_required
def delete_post(post_uuid):
    post_uuid = str(post_uuid)
    current_user_id = current_user.get_id()
    to_delete_post_with_media = Posts.get_post(post_uuid)
    to_delete_post = Posts.delete(post_uuid, current_user_id)    
    
    if (to_delete_post):
        if (len(to_delete_post_with_media["media"]) > 0):
            try:
                cloudinary.delete_post(post_uuid)
            except: 
                return jsonify(success=False, message="delete post failed!"), 500
        return jsonify(success=True, message="delete post successful")        
    else:
        return jsonify(success=False, message="delete post failed!"), 404

@post_bp.route("/<uuid:post_uuid>", methods=["PUT"])
@login_required
def update_post(post_uuid):
    post_uuid = str(post_uuid)
    current_user_id = current_user.get_id()
    caption = request.form.get("caption")
    visibility = request.form.get("visibility")
    form = PostForm()
    current_user_id = current_user.get_id()
    form.current_user_id = current_user_id

    validated = form.validate()
    error = {
            "caption" : form.caption.errors,
            "media" : form.media.errors,
            "planttags" : form.planttags.errors,
            "root" : []
        }
    if validated :
        to_update_post = Posts.update(
            post_uuid=post_uuid,
            caption=caption,
            visibility=visibility,
            current_user_id=current_user_id
        )
    
        if (to_update_post):
            new_post_id = to_update_post["id"]
            print(new_post_id)
            PlantTags.delete_all_of_post(post_id=new_post_id)
            for tag in form.parsed_planttags :
                new_planttag = PlantTags(plant_id=tag['id'], post_id=new_post_id)
                new_planttag.add()


            return jsonify(
                success=True,
                message="edit post successful",
                post_uuid=post_uuid,
                to_update_post=to_update_post,
                planttags=form.parsed_planttags
            )
        else:
            return jsonify(success=False, message="edit post failed!"), 404
    else :
        return jsonify(success=False,
                message="form fields might be invalid",
                error=error), 400