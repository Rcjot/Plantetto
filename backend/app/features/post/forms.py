from flask_wtf import FlaskForm
from flask_wtf.file import FileField, MultipleFileField
from wtforms import StringField, validators, ValidationError, IntegerField
from ...models.plant import Plants
import json

def are_image_video(form, field) :
    files = field.data
    if not files : 
        return

    for file in files :
        if not file :
            form.media_mimetype = None
            continue
        if file.mimetype.startswith("image/") : 
            form.media_mimetype = "image"
            continue
        if file.mimetype.startswith("video/") :
            form.media_mimetype = "video"
            continue
        raise ValidationError("file must be an image or a video!")

def atleast_caption_media(form, field) :
    if (form.caption.data == "" and not field.data) :
        raise ValidationError("post must have at least a caption or a media")


def is_valid_plant(form, field) :
    parsed_tags_list = json.loads(field.data)
    print(parsed_tags_list)
    for tag in parsed_tags_list :
        if (not Plants.check_user_plant_exists_by_id(tag, form.current_user_id)) :
            raise ValidationError("plant must exist or plant selected is not yours")
    form.parsed_planttags = parsed_tags_list

class PostForm(FlaskForm) :
    caption = StringField()
    media = MultipleFileField(validators=[are_image_video, atleast_caption_media])
    planttags = StringField(validators=[is_valid_plant])