from . import notification_bp
from flask import request, jsonify
from flask_login import login_user, login_required, current_user, logout_user
from ...models.notifications import Notifications


@notification_bp.route("/") 
@login_required
def get_notifications():
    limit = request.args.get("limit", default=10, type=int)
    cursor_id = request.args.get("cursor", default=None, type=int)
    current_user_id = current_user.get_id()

    notifications = Notifications.get_notifications(current_user_id, cursor_id, limit)

    has_more = len(notifications) > limit
    notifications = notifications[:limit]
    
    return jsonify(success=True, notifications=notifications,
                   next_cursor = notifications[-1]['id'] if has_more else None,
                   )



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

    

