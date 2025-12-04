from flask import Blueprint

comment_post_bp = Blueprint("comment_post", __name__)

from . import controller