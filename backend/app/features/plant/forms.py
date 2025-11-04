from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators, ValidationError, FileField, IntegerField

class AddPlantForm(FlaskForm) :
    nickname = StringField(validators=[validators.DataRequired()])
    description = PasswordField(validators=[validators.DataRequired()])
    plantpic = FileField()
    plant_type = IntegerField()