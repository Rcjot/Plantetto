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





    

