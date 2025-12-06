from flask import Blueprint

like_post_bp = Blueprint("like_post", __name__)
like_guide_bp = Blueprint("like_guide", __name__)
like_comment_post_bp = Blueprint("like_comment_post", __name__)
like_comment_guide_bp = Blueprint("like_comment_guide", __name__)

from . import controller