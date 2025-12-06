from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from wtforms import StringField, validators, ValidationError, IntegerField
from ...models.guide import Guides
from ...models.comments_guides import CommentsGuides

def guide_exists(form,field) :
    guide = Guides.get_by_uuid(field.data)
    if (not guide) :
        raise ValidationError("guide must exist")
    form.guide_id = guide.id

def parent_exists(form, field) :
    if (not field.data) :
        form.parent_id = None
        return 
    parent_comment = CommentsGuides.get_by_uuid(field.data)
    if (not parent_comment) :
        raise ValidationError("valid parent must exist")
    if ( parent_comment.guide_id != form.guide_id) :
        raise ValidationError("must be under the same guide!")

    form.parent_id = parent_comment.id

class CommentGuideForm(FlaskForm) :
    content = StringField(validators=[validators.DataRequired()])
    guide_uuid = StringField(validators=[validators.DataRequired(), guide_exists])
    parent_uuid = StringField(validators=[parent_exists])

class EditCommentGuideForm(FlaskForm) :
    content = StringField(validators=[validators.DataRequired()])
