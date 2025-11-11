from flask import Blueprint

guide_bp = Blueprint("guide", __name__)

from . import controller
