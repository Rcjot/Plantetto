from . import guide_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from .forms import GuideForm
from ...models.guide import Guides
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



