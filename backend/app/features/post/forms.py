from flask_wtf import FlaskForm
from flask_wtf.file import FileField, MultipleFileField
from wtforms import StringField, validators, ValidationError, IntegerField

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



class PostForm(FlaskForm) :
    caption = StringField()
    media = MultipleFileField(validators=[are_image_video, atleast_caption_media])
