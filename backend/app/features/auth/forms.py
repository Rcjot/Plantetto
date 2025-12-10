from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators, ValidationError, BooleanField
from wtforms.validators import Regexp
from ...models.user import Users

def username_not_ditto(form, field) :
    if (Users.check_username_ditto(field.data)) :
        raise ValidationError("username already taken")

def email_not_ditto(form, field) :
    if (Users.check_email_ditto(field.data)) :
        raise ValidationError("email already taken")

class SignupForm(FlaskForm) :
    username = StringField(validators=[validators.DataRequired(),
                                       Regexp(r'^\S+$', message="cannot contain spaces"),
                                       validators.Length(min=3, max=20), 
                                       username_not_ditto
                                       ],
                           filters=[ lambda x: x.strip() if x else x]
                           )
    email = StringField(validators=[validators.DataRequired(),
                                    validators.Length(min=6, max=50), 
                                    validators.Email(),
                                    email_not_ditto],
                        filters=[ lambda x: x.strip() if x else x]
                        )
    password = PasswordField(validators=[validators.DataRequired()])
    confirm = PasswordField(validators=[validators.DataRequired(), 
                                        validators.EqualTo("password")])

class LoginForm(FlaskForm) :
    username = StringField(validators=[validators.DataRequired()])
    password = PasswordField(validators=[validators.DataRequired()])
    remember = BooleanField()