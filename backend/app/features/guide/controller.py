from . import guide_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from .forms import GuideForm, PatchMetaGuideForm
from ...models.guide import Guides
from ...models.guides_image import GuidesImages
from ...services import cloudinary

@guide_bp.route("/", methods=["POST"]) 
@login_required
def create_guide() :
    form = GuideForm()
    current_user_id = current_user.get_id()
    validated = form.validate()
    error = {
        "plant_type" : form.plant_type.errors,
    }

    if validated :
        new_guide = Guides(plant_type_id=form.plant_type.data, user_id=current_user_id)
        uuid_res = new_guide.add()
        guide_uuid = uuid_res["uuid"]

        return jsonify(success=True, dairy_uuid=guide_uuid)
    return jsonify(success=False,
                    message="form fields might be invalid",
                    error=error), 400

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

@guide_bp.route("/<uuid:guide_uuid>/content", methods=["PATCH"])
@login_required
def patch_content_guide(guide_uuid) :
    data = request.get_data()
    guide_uuid = str(guide_uuid) 
    content = data["content"]
    current_user_id = current_user.get_id()

    to_update_guide = Guides.patch_meta(guide_uuid=guide_uuid,
                                        content=content,
                                        current_user_id=current_user_id)
    if (to_update_guide) :
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