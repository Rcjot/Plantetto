from flask import Blueprint

bookmark_post_bp = Blueprint("bookmark_post", __name__)
bookmark_guide_bp = Blueprint("bookmark_guide", __name__)

from . import controller