from . import plant_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from .forms import PlantForm
from ...models.plant import Plants
from ...services import cloudinary

@plant_bp.route("/<plant_uuid>")
@login_required
def get_plant(plant_uuid) :
    plant = Plants.get_plant(plant_uuid)
    return jsonify(
        plant=plant
    )

@plant_bp.route("/", methods=["POST"])
@login_required
def add_plant() :
    form = PlantForm()
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

@plant_bp.route("/<plant_uuid>", methods=["PUT"])
@login_required
def edit_plant(plant_uuid) :
    to_update_plant = Plants.get_plant(plant_uuid)
    if (to_update_plant == None) :
        return jsonify(success=False, message="no such plant"), 404
    if (str(to_update_plant["owner"]["id"])  != current_user.get_uuid()) :
        return jsonify(success=False, message="plant not yours!"), 403

    form = PlantForm()
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
            Plants.update(plant_uuid=plant_uuid, 
                          nickname=form.nickname.data,
                          description=form.description.data,
                          plant_type=form.plant_type.data)
            if (form.plantpic.data) :
                picture_url = cloudinary.upload_plantpic(form.plantpic.data, plant_uuid)
                Plants.update_picture_url(plant_uuid, picture_url)
        except Exception as e :
            print(e)
            return jsonify(success=False, message="something went wrong trying to update plant"), 500
        return jsonify(success=True, plant_uuid=plant_uuid)

    
    return jsonify(success=False,
                    message="form fields might be invalid",
                    error=error), 400