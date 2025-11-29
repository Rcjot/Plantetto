from . import notification_bp
from flask import request, jsonify
from flask_login import login_user, login_required, current_user, logout_user
from ...models.notifications import Notifications


@notification_bp.route("/") 
@login_required
def get_notifications():
    current_user_id = current_user.get_id()

    notifications = Notifications.get_notifications(current_user_id)
    
    return jsonify(success=True, notifications=notifications)



@notification_bp.route("/", methods=["PATCH"]) 
@login_required
def mark_all_notifications_read():
    current_user_id = current_user.get_id()

    Notifications.mark_all_read(current_user_id)
    
    return jsonify(success=True)

@notification_bp.route("/<notification_id>", methods=["PATCH"]) 
@login_required
def mark_notification_read(notification_id):

    Notifications.patch_read(notification_id)
    
    return jsonify(success=True)

    

