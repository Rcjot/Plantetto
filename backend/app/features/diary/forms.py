from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from wtforms import StringField, validators, ValidationError, IntegerField
from ...models.plant import Plants

def is_image_video(form, field) :
    file = field.data

    if not file :
        form.media_mimetype = None
        return
    if file.mimetype.startswith("image/") : 
        form.media_mimetype = "image"
        return
    if file.mimetype.startswith("video/") :
        form.media_mimetype = "video"
        return
    raise ValidationError("file must be an image or a video!")

def user_plant_exists(form,field) :
    if (not Plants.check_user_plant_exists_by_id(field.data, form.current_user_id)) :
        raise ValidationError("plant must exist or plant selected is not yours")


class DiaryForm(FlaskForm) :
    note = StringField(validators=[validators.DataRequired()])
    media = FileField(validators=[is_image_video])
    plant_id = IntegerField(validators=[user_plant_exists])