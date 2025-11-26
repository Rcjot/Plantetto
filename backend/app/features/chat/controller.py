from . import chat_bp
from flask import request, jsonify
from ...models.conversation import Conversations
from ...models.message import Messages
from ...models.user import Users
from flask_login import login_user, login_required, current_user, logout_user

@chat_bp.route("/room/<uuid:conversation_uuid>")
@login_required
def get_conversation_by_uuid(conversation_uuid) :
    conversation_uuid = str(conversation_uuid)
    current_user_id = current_user.get_id()

    conversation_room = Conversations.get_conversation_by_uuid(conversation_uuid, current_user_id)

    return jsonify(conversation_room=conversation_room)

@chat_bp.route("/room/<username>")
@login_required
def get_conversation_with_user(username) :
    recipient_username = username
    recipient_id_res = Users.get_id_uuid_by_username(recipient_username)
    res = Conversations.get_conversation_with_user(recipient_id=recipient_id_res["id"],current_user_id=current_user.get_id())

    if res is None :
        return jsonify(conversation_room=None)

    return jsonify(conversation_room=res)

@chat_bp.route("/rooms")
@login_required
def get_conversation_rooms() :
    limit = request.args.get("limit", default=20, type=int)
    search = request.args.get("search", default="", type=str)
    cursor_timestamp = request.args.get("cursor", default=None, type=str)
    if cursor_timestamp == "null" :
        cursor_timestamp = None
    current_user_id = current_user.get_id()

    conversation_rooms = Conversations.get_all_conversation_rooms(current_user_id, search, cursor_timestamp, limit)

    has_more = len(conversation_rooms) > limit
    conversation_rooms = conversation_rooms[:limit]

    return jsonify(conversation_rooms=conversation_rooms,
                   next_cursor = conversation_rooms[-1]['recent_message_date'] if has_more else None,
                   )

# no route for adding message since it is handled with sockets

@chat_bp.route("/room/<uuid:conversation_uuid>/messages")
@login_required
def get_conversation_messages(conversation_uuid) :
    limit = request.args.get("limit", default=20, type=int)
    cursor_id = request.args.get("cursor", default=None, type=int)
    conversation_uuid = str(conversation_uuid)
    current_user_id = current_user.get_id()

    messages = Messages.all_under_conversation(current_user_id, conversation_uuid, cursor_id, limit)
    has_more = len(messages) > limit
    messages = messages[:limit]

    return jsonify(messages=messages,
                   next_cursor = messages[-1]['id'] if has_more else None,
                   )

@chat_bp.route("/room/<uuid:conversation_uuid>/participants")
@login_required
def get_conversation_participants(conversation_uuid) :
    conversation_uuid = str(conversation_uuid)

    participants = Conversations.get_all_conversation_participants(conversation_uuid)

    return jsonify(participants=participants)



