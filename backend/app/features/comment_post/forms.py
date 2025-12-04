from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from wtforms import StringField, validators, ValidationError, IntegerField
from ...models.post import Posts
from ...models.comments_posts import CommentsPosts

def post_exists(form, field):
    post = Posts.get_by_uuid(field.data)
    if not post:
        raise ValidationError("post must exist")
    form.post_id = post.id

def parent_exists(form, field):
    if not field.data:
        form.parent_id = None
        return 
    parent_comment = CommentsPosts.get_by_uuid(field.data)
    if not parent_comment:
        raise ValidationError("valid parent must exist")
    if parent_comment.post_id != form.post_id:
        raise ValidationError("must be under the same post!")

    form.parent_id = parent_comment.id

class CommentPostForm(FlaskForm):
    class Meta:
        csrf = False

    content = StringField(validators=[validators.DataRequired()])
    post_uuid = StringField(validators=[validators.DataRequired(), post_exists])
    parent_uuid = StringField(validators=[parent_exists])

class EditCommentPostForm(FlaskForm):
    class Meta:
        csrf = False

    content = StringField(validators=[validators.DataRequired()])