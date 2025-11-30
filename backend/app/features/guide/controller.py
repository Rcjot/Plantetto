from . import guide_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from .forms import GuideForm, PatchMetaGuideForm
from ...models.guide import Guides
from ...models.guides_image import GuidesImages
from ...services import cloudinary
from ...models.notifications import Notifications
from ...sockets import notify_followers_of_guide
import json
import math

@guide_bp.route("/")
@login_required
def get_published_guides() :
    search = request.args.get("search", default="", type=str)
    plant_type_id = request.args.get("plant_type_id", default=None, type=int)
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default = 12, type=int)

    offset = (page - 1) * limit

    result = Guides.get_published_guides(search, plant_type_id, limit, offset)
    guides = result["guides"]
    total_count = result["meta_data"]["total_count"]
    result_count = result["meta_data"]["result_count"]
    max_page = math.ceil(result_count / limit)
    meta_data = {
        "page" : page,
        "total_count" : total_count,
        "limit" : limit,
        "max_page" : max_page,
        "has_next" : page < max_page,
        "has_prev" : page > 1,
    }

    return jsonify(
        guides=guides,
        meta_data=meta_data
    )


@guide_bp.route("/", methods=["POST"]) 
@login_required
def create_guide() :
    current_user_id = current_user.get_id()

    new_guide = Guides(user_id=current_user_id)
    uuid_res = new_guide.add()
    guide_uuid = uuid_res["uuid"]

            
    return jsonify(success=True, guide_uuid=guide_uuid)


@guide_bp.route("/<uuid:guide_uuid>")
@login_required
def get_guide(guide_uuid) :
    guide_uuid = str(guide_uuid)
    result = Guides.get_guide(guide_uuid)


    return jsonify(
        guide=result
    )


@guide_bp.route("/<uuid:guide_uuid>/metadata", methods=["PATCH"])
@login_required
def patch_meta_guide(guide_uuid) :
    guide_uuid = str(guide_uuid) 
    form = PatchMetaGuideForm()
    current_user_id = current_user.get_id()
    validated = form.validate()
    error = {
        "title" : form.title.errors,
        "plant_type" : form.plant_type.errors,
        "root" : []
    }

    if validated :
        to_update_guide = Guides.patch_meta(guide_uuid=guide_uuid,title=form.title.data, plant_type_id=form.plant_type.data, current_user_id=current_user_id)
        if (to_update_guide) :
            return jsonify(success=True, guide_uuid=guide_uuid)
        return jsonify(success=False, message="update plant failed"), 404

    return jsonify(success=False,
                    message="form fields might be invalid",
                    error=error), 400

def get_content_image(content) :
    images = []

    def traverse(node) :
        if isinstance(node, dict) :
            if node.get("type") == "image" and "attrs" in node and "src" in node["attrs"] :
                images.append(node["attrs"]["src"])
            if "content" in node :
                for child in node["content"] :
                    traverse(child)
    traverse(content)
    return images

@guide_bp.route("/<uuid:guide_uuid>/content", methods=["PATCH"])
@login_required
def patch_content_guide(guide_uuid) :
    data = request.get_json()
    guide_uuid = str(guide_uuid) 
    used_images = get_content_image(data["content"])
    content = json.dumps(data["content"])
    current_user_id = current_user.get_id()
    guide = Guides.get_guide_id(guide_uuid)


    to_update_guide = Guides.patch_content(guide_uuid=guide_uuid,
                                        content=content,
                                        current_user_id=current_user_id)
    
    unused_images = GuidesImages.delete_unused_images(used_images, guide['id'])
    for image_tuple in unused_images :
        cloudinary.delete_guideimage(image_tuple[0], guide_uuid)   

    if (to_update_guide) :
        return jsonify(success=True, guide_uuid=guide_uuid)
    return jsonify(success=False, message="update plant failed"), 404

@guide_bp.route("/<uuid:guide_uuid>/status", methods=["PATCH"])
@login_required
def patch_status_guide(guide_uuid) :
    data = request.get_json()
    guide_uuid = str(guide_uuid)
    status = data["status"]

    current_user_id = current_user.get_id()
    to_update_guide = Guides.patch_status(guide_uuid=guide_uuid, status=status, current_user_id=current_user_id )

   

    if (to_update_guide) :
        if status == "published" :
                payload = Notifications.generate_notifications_guide(entity_id=to_update_guide['id'],
                                                                    title=to_update_guide['title'],
                                                                    actor=current_user.get_json(),
                                                                    entity_uuid=guide_uuid,
                                                                    actor_id=current_user_id
                                                                    )
                notify_followers_of_guide(author_uuid=current_user.get_uuid(),
                                          new_guide_payload=payload)

        return jsonify(success=True, guide_uuid=guide_uuid)
    return jsonify(success=False, message="update plant failed"), 404


@guide_bp.route("/<uuid:guide_uuid>/images", methods=["POST"])
@login_required
def upload_image(guide_uuid) :
    guide_uuid = str(guide_uuid)
    file = request.files['image']
    guide = Guides.get_guide_id(guide_uuid)

    new_guides_image = GuidesImages(guide_id=guide['id'])
    uuid_res = new_guides_image.add()
    guides_image_uuid = uuid_res["uuid"]
    try :
        media_res = cloudinary.upload_asset(asset=file, 
                                            public_id=f"guides_image_{guides_image_uuid}",
                                            media_type="image",
                                            folder=f"guides/{guide_uuid}/"
                                            )
        GuidesImages.update_image(guides_image_uuid, media_res["srcURL"])
        return jsonify(success=True, message="uploaded immage succsesfully", image_url=media_res["srcURL"])
    except Exception as e :
        print(e)
        return jsonify(success=False, message="something went wrong trying to upload image", image_url=None), 500

@guide_bp.route("/<uuid:guide_uuid>", methods=["DELETE"])
def delete_guide(guide_uuid) :
    guide_uuid = str(guide_uuid)
    guide = Guides.get_guide_id(guide_uuid)
    guide_id = guide['id']
    guide_has_images = GuidesImages.check_guide_has_images(guide_id)
    to_delete_guide = Guides.delete_guide(guide_uuid, current_user.get_id())
    if (to_delete_guide):
        if guide_has_images :
            try :
                cloudinary.delete_guide(guide_uuid)
            except : 
                return jsonify(success=True, message="delete guide failed!"), 500
        return jsonify(success=True, message="delete guide successful")
    else :
        return jsonify(success=False, message="delete guide failed"), 404
