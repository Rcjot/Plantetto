from flask_socketio import SocketIO, send, join_room, leave_room, emit
from . import socketio
from flask_login import login_user, login_required, current_user, logout_user
from .models.conversation import Conversations
from .models.user import Users
from app.models import conversation

@socketio.on("connect") 
def handle_connect() :
    print("Client connected!")

@socketio.on('chat_message')
def handle_chat_message(data):
     
    conversation_room = data['room']
    sender_obj = data['sender']
    print(conversation_room)
    if not conversation_room :

        sender_username = data['sender_username']
        recipient_username = data['recipient_username']
        sender_res = Users.get_id_uuid_by_username(sender_username)
        sender_id = sender_res['id']
        sender_uuid = sender_res['uuid']
        recipient_res = Users.get_id_uuid_by_username(recipient_username)
        recipient_id = recipient_res['id']
        recipient_uuid = recipient_res['uuid']
        
        # double check that conversation does not exist yet
        conversation_res =  Conversations.check_conversation_exists(sender_id, recipient_id)

        if conversation_res is None : 
        
            new_conversation_res = Conversations.add_conversation()
            conversation_room = new_conversation_res['uuid']
            Conversations.add_conversation_participants(sender_id, new_conversation_res['uuid'])
            Conversations.add_conversation_participants(recipient_id, new_conversation_res['uuid'])

            join_room(conversation_room)
            emit("request_join", conversation_room, to=recipient_uuid)
            print("requested recipient to join", conversation_room)
        else : 
            conversation_room = conversation_res['uuid']
            print('already have conversation', conversation_room)
    else :
        print("already have passed conversation", conversation_room)

    message = data['message']
    payload = {
        "sender": sender_obj,
        "message": message
    } 
    # add message entry in db
    # added entry should return details in message creation
    # include details in message payload
    # message -> message_res

    emit("new_message", payload, to=conversation_room)


@socketio.on("join")
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    print(username, 'has entered', room)



@socketio.on("join_rooms") 
def join_rooms() :
    if not current_user.is_authenticated : 
        return
    current_user_id = current_user.get_id()
    print('hey')
    # fetch all rooms in db, 
    # for room in fetched_rooms : join_room(room)
