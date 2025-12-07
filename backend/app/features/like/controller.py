from . import like_post_bp, like_guide_bp, like_comment_post_bp, like_comment_guide_bp
from flask import jsonify, request
from flask_login import login_required, current_user
from ...models.like import Likes
from ...models.post import Posts
from ...models.guide import Guides
from ...models.comments_guides import CommentsGuides
from ...models.comments_posts import CommentsPosts
from ...models.notifications import Notifications
from ...sockets import notify_like
import json

@like_post_bp.route("/", methods=["POST"])
@login_required
def toggle_like_post(post_uuid) :
    post_uuid = str(post_uuid)

    post_res = Posts.get_by_uuid(post_uuid)
    if post_res :
        post_id = post_res.id

        current_user_id = current_user.get_id()

        message = Likes.toggle_like_post(current_user_id, post_id)

        author_id_uuid_res = Posts.get_post_author_id_uuid(post_uuid)

        if (message=="like" and str(current_user_id) != str(author_id_uuid_res['id'])) :
            #generate notification
            payload = json.dumps({
                "actor" : current_user.get_json(),
                "entity_uuid" : post_uuid
            })


            new_notif = Notifications(user_id=author_id_uuid_res['id'],
                                    actor_id=current_user_id,
                                    notification_type="like_post", 
                                    payload=payload, 
                                    entity_id=post_id)
            new_like_payload = new_notif.add_likes_notif()
            new_like_payload['created_at'] = new_like_payload['created_at'].isoformat()

            new_notif_payload = {
                "payload" : new_like_payload,
                "notif_type" : "like_post"
            }

            notify_like(author_id_uuid_res['uuid'], new_notif_payload)

        return jsonify(success=True, message=f"successfully {message} post", action=message)
    else :
        return jsonify(success=False, message=f"resource not found", action=None), 404

@like_guide_bp.route("/", methods=["POST"])
@login_required
def toggle_like_guide(guide_uuid) :
    guide_uuid = str(guide_uuid)

    guide_res = Guides.get_guide_id(guide_uuid)
    if guide_res :
        guide_id = guide_res['id']

        current_user_id = current_user.get_id()

        message = Likes.toggle_like_guide(current_user_id, guide_id)

        author_id_uuid_res = Guides.get_guide_author_id_uuid(guide_uuid)

        if (message=="like" and str(current_user_id) != str(author_id_uuid_res['id'])) :
            #generate notification
            payload = json.dumps({
                "actor" : current_user.get_json(),
                "entity_uuid" : guide_uuid
            })


            new_notif = Notifications(user_id=author_id_uuid_res['id'],
                                    actor_id=current_user_id,
                                    notification_type="like_guide", 
                                    payload=payload, 
                                    entity_id=guide_id)
            new_like_payload = new_notif.add_likes_notif()
            new_like_payload['created_at'] = new_like_payload['created_at'].isoformat()

            new_notif_payload = {
                "payload" : new_like_payload,
                "notif_type" : "like_guide"
            }

            notify_like(author_id_uuid_res['uuid'], new_notif_payload)


        return jsonify(success=True, message=f"successfully {message} guide", action=message)
    else :
        return jsonify(success=False, message=f"resource not found", action=None), 404


@like_comment_post_bp.route("/", methods=["POST"])
@login_required
def toggle_like_comment_post(comment_uuid) :
    comment_uuid = str(comment_uuid)

    comment_res = CommentsPosts.get_by_uuid(comment_uuid)
    if comment_res :
        comment_id = comment_res.id
        

        current_user_id = current_user.get_id()

        message = Likes.toggle_like_comment_posts(current_user_id, comment_id)


        author_post_id_uuid_res = CommentsPosts.get_comment_author_post_id_uuid(comment_uuid)

        if (message=="like" and str(current_user_id) != str(author_post_id_uuid_res['user_id'])) :
            #generate notification
            payload = json.dumps({
                "actor" : current_user.get_json(),
                "entity_uuid" : author_post_id_uuid_res['post_uuid']
            })


            new_notif = Notifications(user_id=author_post_id_uuid_res['user_id'],
                                    actor_id=current_user_id,
                                    notification_type="like_comment_post", 
                                    payload=payload, 
                                    entity_id=author_post_id_uuid_res['post_id'])
            new_like_payload = new_notif.add_likes_notif()
            new_like_payload['created_at'] = new_like_payload['created_at'].isoformat()

            new_notif_payload = {
                "payload" : new_like_payload,
                "notif_type" : "like_comment_post"
            }

            notify_like(author_post_id_uuid_res['user_uuid'], new_notif_payload)



        return jsonify(success=True, message=f"successfully {message} comment", action=message)
    else :
        return jsonify(success=False, message=f"resource not found", action=None), 404


@like_comment_guide_bp.route("/", methods=["POST"])
@login_required
def toggle_like_comment_guide(comment_uuid) :
    comment_uuid = str(comment_uuid)

    comment_res = CommentsGuides.get_by_uuid(comment_uuid)
    if comment_res :
        comment_id = comment_res.id

        current_user_id = current_user.get_id()

        message = Likes.toggle_like_comment_guides(current_user_id, comment_id)
        author_guide_id_uuid_res = CommentsGuides.get_comment_author_guide_id_uuid(comment_uuid)

        if (message=="like" and str(current_user_id) != str(author_guide_id_uuid_res['user_id'])) :
            #generate notification
            payload = json.dumps({
                "actor" : current_user.get_json(),
                "entity_uuid" : author_guide_id_uuid_res['guide_uuid']
            })


            new_notif = Notifications(user_id=author_guide_id_uuid_res['user_id'],
                                    actor_id=current_user_id,
                                    notification_type="like_comment_guide", 
                                    payload=payload, 
                                    entity_id=author_guide_id_uuid_res['guide_id'])
            new_like_payload = new_notif.add_likes_notif()
            new_like_payload['created_at'] = new_like_payload['created_at'].isoformat()

            new_notif_payload = {
                "payload" : new_like_payload,
                "notif_type" : "like_comment_guide"
            }

            notify_like(author_guide_id_uuid_res['user_uuid'], new_notif_payload)




        return jsonify(success=True, message=f"successfully {message} comment", action=message)
    else :
        return jsonify(success=False, message=f"resource not found", action=None), 404