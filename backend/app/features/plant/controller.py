from . import plant_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from .forms import AddPlantForm
from ...models.plant import Plants
from ...services import cloudinary

@plant_bp.route("/", methods=["POST"])
@login_required
def add_plant() :
    form = AddPlantForm()
    current_user_id = current_user.get_id()
    validated = form.validate()
    error = {
        "nickname" : form.nickname.errors,
        "description" : form.description.errors,
        "plantpic" : form.plantpic.errors,
        "plant_type" : form.plant_type.errors,
    }
    if validated : 
        try :
            print()
            new_plant = Plants(nickname=form.nickname.data,
                            description=form.description.data,
                            plant_type=form.plant_type.data,
                            user_id=current_user_id)
            uuid_res = new_plant.add()
            plant_uuid = uuid_res['uuid']
            if (form.plantpic.data) :
                picture_url = cloudinary.upload_plantpic(form.plaqntpic.data, plant_uuid)
                Plants.update_picture_url(plant_uuid, picture_url)
        except Exception as e :
            print(e)
            return jsonify(success=False, message="something went wrong trying to add plant"), 500
        return jsonify(success=True, plant_uuid=plant_uuid)

    return jsonify(success=False,
                    message="form fields might be invalid",
                    error=error), 400



    
    # picture_url = cloudinary