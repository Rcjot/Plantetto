from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators, ValidationError, BooleanField
from ...models.user import Users


def email_not_ditto(form, field) :
    if (Users.check_email_ditto(field.data)) :
        raise ValidationError("email already taken or is yours already")

class ChangePasswordForm(FlaskForm) :
    currentPassword = PasswordField(validators=[validators.DataRequired()])
    newPassword = PasswordField(validators=[validators.DataRequired()])
    confirmNewPassword = PasswordField(validators=[validators.DataRequired(), 
                                        validators.EqualTo("newPassword", message="is not equal to password")])

class ChangeEmailForm(FlaskForm) :
    newEmail = StringField(validators=[validators.DataRequired(),
                                    validators.Length(min=6, max=50), 
                                    validators.Email(),
                                    email_not_ditto],
                        filters=[ lambda x: x.strip() if x else x]
                        )