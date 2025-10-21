from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators

class SignupForm(FlaskForm) :
    username = StringField(validators=[validators.DataRequired(),
                                       validators.Length(min=3, max=20)])
    email = StringField(validators=[validators.DataRequired(),
                                    validators.Length(min=6, max=50), 
                                    validators.Email()])
    password = PasswordField(validators=[validators.DataRequired()])
    confirm = PasswordField(validators=[validators.DataRequired(), 
                                        validators.EqualTo("password")])