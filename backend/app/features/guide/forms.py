from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from wtforms import StringField, validators, ValidationError, IntegerField
from ...models.plant import Plants

def plant_type_exists(form, field) :
    if (not Plants.check_plant_type_exists(field.data)) :
        raise ValidationError("plant type doesn't exist")


class GuideForm(FlaskForm) :
    plant_type = IntegerField(validators=[plant_type_exists])