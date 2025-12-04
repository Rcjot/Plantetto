from flask import Blueprint

comment_guide_bp = Blueprint("comment_guide", __name__)

from . import controller