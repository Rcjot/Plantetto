from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from wtforms import StringField, validators, ValidationError, IntegerField
from ...models.plant import Plants

def is_image(form, field) :
    file = field.data

    if not file :
        return
    if not file.mimetype.startswith("image/") :
        raise ValidationError("file must be an image!")

def plant_type_exists(form, field) :
    if (not Plants.check_plant_type_exists(field.data)) :
        raise ValidationError("plant type doesn't exist")

class AddPlantForm(FlaskForm) :
    nickname = StringField(validators=[validators.DataRequired()])
    description = StringField()
    plantpic = FileField(validators=[is_image])
    plant_type = IntegerField(validators=[plant_type_exists])