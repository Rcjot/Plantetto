from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from wtforms import DecimalField, StringField, validators, ValidationError, IntegerField
from ...models.plant import Plants
from ...models.market import MarketItems

def user_plant_exists(form,field) :
    if (not Plants.check_user_plant_exists_by_id(field.data, form.current_user_id)) :
        raise ValidationError("plant must exist or plant selected is not yours")
    if (MarketItems.check_plant_is_item(field.data, form.current_user_id)) :
        raise ValidationError("plant is already put up for sale")


class MarketItemForm(FlaskForm) :
    description = StringField(validators=[validators.Length(max=255)])
    price = DecimalField(validators=[validators.DataRequired()]) 
    plant_id = IntegerField(validators=[user_plant_exists])

class UpdateMarketItemForm(FlaskForm) :
    description = StringField(validators=[validators.Length(max=255)])
    price = DecimalField(validators=[validators.DataRequired()]) 