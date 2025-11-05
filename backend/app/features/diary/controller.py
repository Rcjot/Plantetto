from . import diary_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from .forms import DiaryForm
from ...models.diary import Diaries
from ...services import cloudinary
from datetime import date, timedelta


@diary_bp.route("/", methods=["POST"]) 
@login_required
def add_diary():
    form = DiaryForm()
    current_user_id = current_user.get_id()
    form.current_user_id = current_user_id
    validated = form.validate()
    error = {
        "note" : form.note.errors,
        "media" : form.media.errors,
        "plant_id": form.plant_id.errors,
    }
    if validated : 
        try :
            new_diary = Diaries(note=form.note.data, 
                                plant_id=form.plant_id.data, 
                                user_id=current_user_id )
            uuid_res = new_diary.add()
            diary_uuid = uuid_res["uuid"]
            if (form.media.data) :
                media_res = cloudinary.upload_asset(asset=form.media.data, 
                                                    public_id=f"diary_{diary_uuid}",
                                                    media_type=form.media_mimetype,
                                                    folder="diaries/"
                                                    )
                Diaries.update_media(diary_uuid, media_res["srcURL"], media_type=form.media_mimetype)
        except Exception as e :
            print(e)
            return jsonify(success=False, message="something went wrong trying to add plant"), 500
        return jsonify(success=True, dairy_uuid=diary_uuid)
    return jsonify(success=False,
                    message="form fields might be invalid",
                    error=error), 400

@diary_bp.route("/<uuid:diary_uuid>", methods=["PUT"])
@login_required
def edit_diary(diary_uuid) :
    diary_uuid = str(diary_uuid)
    form = DiaryForm()
    current_user_id = current_user.get_id()
    form.current_user_id = current_user_id
    validated = form.validate()
    error = {
        "note" : form.note.errors,
        "media" : form.media.errors,
        "plant_id": form.plant_id.errors,
    }



    if validated : 
        to_update_plant= Diaries.update(diary_uuid=diary_uuid,
                                        note=form.note.data, 
                                        plant_id=form.plant_id.data,
                                        current_user_id=current_user_id)
        if (to_update_plant) :
            media_url = to_update_plant["media_url"]
            media_type = to_update_plant["media_type"]
            if (form.media.data) :
                try :
                    media_res = cloudinary.upload_asset(asset=form.media.data, 
                                                        public_id=f"diary_{diary_uuid}",
                                                        media_type=form.media_mimetype,
                                                        folder="diaries/"
                                                        )
                    Diaries.update_media(diary_uuid, media_res["srcURL"], media_type=form.media_mimetype)
                    media_url = media_res["srcURL"]
                    media_type = form.media_mimetype
                except Exception as e :
                    print(e)
                    return jsonify(success=False, message="something went wrong trying to update plant"), 500
        else : 
            return jsonify(success=False, message="update plant failed"), 404
        
        
        return jsonify(success=True, 
                       diary={
                            "uuid" : to_update_plant["uuid"],
                            "note" : to_update_plant["note"],
                            "plant_id" : to_update_plant["plant_id"],
                            "media_url" : media_url,
                            "media_type" : media_type,
                            "created_at" : to_update_plant["created_at"],
                            "plant" : to_update_plant["nickname"]
                        })

    return jsonify(success=False,
                    message="form fields might be invalid",
                    error=error), 400