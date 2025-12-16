from flask import Blueprint

bookmark_post_bp = Blueprint("bookmark_post", __name__)
bookmark_guide_bp = Blueprint("bookmark_guide", __name__)
bookmark_market_item_bp = Blueprint("bookmark_market_item", __name__)
bookmark_list_bp = Blueprint("bookmark_list", __name__)

from . import controller