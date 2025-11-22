from . import chat_bp
from flask import request, jsonify
from ...models.conversation import Conversations
from ...models.user import Users
from flask_login import login_user, login_required, current_user, logout_user


@chat_bp.route("/room/<username>")
@login_required
def get_conversation_with_user(username) :
    recipient_username = username
    recipient_id_res = Users.get_id_uuid_by_username(recipient_username)
    res = Conversations.check_conversation_exists(recipient_id_res["id"], current_user.get_id())

    if res is None :
        return jsonify(conversation_room=None)

    return jsonify(conversation_room=res['uuid'])

@chat_bp.route("/rooms")
@login_required
def get_conversation_rooms() :
    current_user_id = current_user.get_id()
    conversation_rooms = Conversations.get_all_conversation_rooms(current_user_id)

    return jsonify(conversation_rooms=conversation_rooms)
