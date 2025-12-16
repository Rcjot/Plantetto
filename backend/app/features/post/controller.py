from . import post_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from ...services import cloudinary
from ...models.post import Posts
from ...models.media import Media
from ...models.planttag import PlantTags
from ...models.notifications import Notifications
from ...sockets import notify_followers_of_post
from .forms import PostForm
from .forms import PostEditForm
import json

@post_bp.route("", strict_slashes=False) 
@login_required
def get_posts():
    """
    Get posts with support for both cursor formats:
    - New format: JSON with 'score' and 'timestamp' for priority-based feed
    - Old format: Simple integer cursor_id
    """
    try:
        limit = request.args.get("limit", default=10, type=int)
        cursor_data = request.args.get("cursor", default=None, type=str)
        next_cursor_param = request.args.get("next_cursor", default=None, type=str)
        
        current_user_id = current_user.get_id()
        
        # Parse cursor
        cursor_score = None
        cursor_timestamp = None
        
        # Try to parse as new format cursor (JSON)
        if cursor_data:
            try:
                cursor_obj = json.loads(cursor_data)
                cursor_score = cursor_obj.get("score")
                cursor_timestamp = cursor_obj.get("timestamp")
            except (json.JSONDecodeError, TypeError):
                # Not valid JSON, will try old format
                pass
        
        # If we have next_cursor param (old format), use it
        if (cursor_score is None or cursor_timestamp is None) and next_cursor_param:
            try:
                # Convert old cursor_id to new format
                cursor_score = 1  # Default score for old cursors
                cursor_timestamp = None  # Will let Posts.all handle None timestamp
            except ValueError:
                pass
        
        # Call Posts.all with the correct parameters
        result = Posts.all(limit, cursor_score, cursor_timestamp, current_user_id)
        
        feed = result if result else []
        has_more = len(feed) > limit
        feed = feed[:limit]
        
        # Create next cursor
        next_cursor = None
        if has_more and feed:
            last_post = feed[-1]
            if 'priority_score' in last_post:
                # New format
                next_cursor = json.dumps({
                    "score": last_post['priority_score'],
                    "timestamp": last_post['created_at'].isoformat()
                })
            elif 'cursor_id' in last_post:
                # Old format - for backward compatibility
                next_cursor = str(last_post['cursor_id'])
        
        return jsonify(
            feed=feed,
            next_cursor=next_cursor,
        )
        
    except Exception as e:
        print(f"Error in get_posts: {str(e)}")
        return jsonify(error="Internal server error"), 500
    
@post_bp.route("/<post_uuid>")
@login_required
def get_post(post_uuid):
    # Pass current_user_id to get liked status
    current_user_id = current_user.get_id()
    post = Posts.get_post(post_uuid, current_user_id)
    return jsonify(
        post=post
    )

@post_bp.route("/explore")
@login_required
def explore_posts():
    limit = request.args.get("limit", default=10, type=int)
    search = request.args.get("search", default="", type=str)
    cursor = request.args.get("cursor", default=None, type=str)
    plant_type = request.args.get("planttype", default=None, type=str)

    current_user_id = int(current_user.get_id())

    if plant_type:
        feed = Posts.explorePostsOfPlant(
            limit=limit,
            search=search,
            cursor_timestamp=cursor,
            plant_type=plant_type,
            current_user_id=current_user_id
        )
    else:
        # Pass current_user_id to get liked status
        feed = Posts.explore(
            limit=limit,
            search=search,
            cursor_timestamp=cursor,
            plant_type=plant_type,
            current_user_id=current_user_id
        )

    has_more = len(feed) > limit
    feed = feed[:limit]
    next_cursor = feed[-1]["created_at"] if has_more and feed else None

    return jsonify(feed=feed, next_cursor=next_cursor)


@post_bp.route("/", methods=["POST"])
@login_required
def create_post():
    current_user_id = current_user.get_id()
    caption = request.form.get("caption")
    visibility = request.form.get("visibility", "everyone")
    mediaList = request.files.getlist('media')
    form = PostForm()
    form.current_user_id = current_user_id

    validated = form.validate()
    error = {
        "caption": form.caption.errors,
        "media": form.media.errors,
        "planttags": form.planttags.errors,
        "root": []
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

            actor = current_user.get_json()

            payload = Notifications.generate_notifications_post(entity_id=new_post_id,
                                                      caption=caption,
                                                      actor=actor,
                                                      entity_uuid=new_post_uuid,
                                                      actor_id=current_user_id
                                                      )
            if payload :
                notify_followers_of_post(author_uuid=current_user.get_uuid(),
                                        new_post_payload=payload
                                        )

            
                # Add plant tags if they exist
                if hasattr(form, 'parsed_planttags') and form.parsed_planttags:
                    for tag in form.parsed_planttags:
                        new_planttag = PlantTags(plant_id=tag['id'], post_id=new_post_id)
                        new_planttag.add()
            
            # Get the created post with current_user_id to include liked status
            new_post = Posts.get_post(new_post_uuid, current_user_id)
            
            # Add planttags to the response if they exist
            if hasattr(form, 'parsed_planttags'):
                new_post['planttags'] = form.parsed_planttags
                
            return jsonify(
                success=True,
                post_uuid=new_post_uuid,
                new_post=new_post,
            )

        except Exception as e:
            print(e)
            # delete newly created post when something went wrong, we cancel it 
            # idk if this is good practice, prolly not ...

            to_delete_post_with_media = Posts.get_post(new_post_uuid, current_user_id)
            to_delete_post = Posts.delete(new_post_uuid, current_user_id)    
            
            if to_delete_post:
                if to_delete_post_with_media and len(to_delete_post_with_media.get("media", [])) > 0:
                    try:
                        cloudinary.delete_post(new_post_uuid)
                    except Exception as e: 
                        print(e)

            error["root"] = ["something went wrong creating a post"]
            return jsonify(success=False, error=error), 500
    
    return jsonify(
        success=False,
        message="form fields might be invalid",
        error=error
    ), 400

@post_bp.route("/<uuid:post_uuid>", methods=["DELETE"])
@login_required
def delete_post(post_uuid):
    post_uuid = str(post_uuid)
    current_user_id = current_user.get_id()
    
    # Get post with media for cloudinary deletion
    to_delete_post_with_media = Posts.get_post(post_uuid, current_user_id)
    to_delete_post = Posts.delete(post_uuid, current_user_id)    
    
    if to_delete_post:
        if to_delete_post_with_media and len(to_delete_post_with_media.get("media", [])) > 0:
            try:
                cloudinary.delete_post(post_uuid)
            except Exception as e: 
                print(e)
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
    
    form = PostEditForm()
    form.current_user_id = current_user_id

    validated = form.validate()
    error = {
        "caption": form.caption.errors,
        "planttags": form.planttags.errors if hasattr(form, 'planttags') else [],
        "root": []
    }
    
    if validated:
        to_update_post = Posts.update(
            post_uuid=post_uuid,
            caption=caption,
            visibility=visibility,
            current_user_id=current_user_id
        )

        if to_update_post:
            new_post_id = to_update_post["id"]
            
            # Update plant tags if planttags form field exists
            if hasattr(form, 'parsed_planttags'):
                PlantTags.delete_all_of_post(post_id=new_post_id)
                for tag in form.parsed_planttags:
                    new_planttag = PlantTags(plant_id=tag['id'], post_id=new_post_id)
                    new_planttag.add()

            # Get updated post with current_user_id to include liked status
            updated_post = Posts.get_post(post_uuid, current_user_id)
            
            response_data = {
                "success": True,
                "message": "edit post successful",
                "post_uuid": post_uuid,
                "to_update_post": updated_post
            }
            
            # Add planttags to response if they exist
            if hasattr(form, 'parsed_planttags'):
                response_data["planttags"] = form.parsed_planttags
                
            return jsonify(**response_data)
        else:
            return jsonify(success=False, message="edit post failed!"), 404
    else:
        return jsonify(
            success=False,
            message="form fields might be invalid",
            error=error
        ), 400
