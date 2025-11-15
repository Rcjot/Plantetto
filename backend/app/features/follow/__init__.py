from flask import Blueprint

follow_bp = Blueprint("follow", __name__)

from . import controller