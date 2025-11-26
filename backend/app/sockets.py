from flask_socketio import SocketIO, send, join_room, leave_room, emit
from . import socketio
from flask_login import login_user, login_required, current_user, logout_user
from .models.conversation import Conversations
from .models.message import Messages
from .models.user import Users

@socketio.on("connect") 
def handle_connect() :

    print(current_user.is_authenticated)
    print("Client connected!")

@socketio.on('chat_message')
def handle_chat_message(data):
 
   
    conversation_room = data['room']
    sender_obj = data['sender']

    message = data['message']

    sender_username = data['sender_username']
    recipient_username = data['recipient_username']
    print(sender_username, 'sent a message to', recipient_username)

    sender_res = Users.get_id_uuid_by_username(sender_username)
    sender_id = sender_res['id']
    sender_uuid = sender_res['uuid']
    recipient_res = Users.get_id_uuid_by_username(recipient_username)
    recipient_id = recipient_res['id']
    recipient_uuid = recipient_res['uuid']
 
    room_destination = conversation_room
    if not conversation_room :


        
        # double check that conversation does not exist yet
        conversation_res =  Conversations.check_conversation_exists(sender_id, recipient_id)

        if conversation_res is None : 
        
            new_conversation_res = Conversations.add_conversation()
            conversation_room = new_conversation_res['uuid']
            Conversations.add_conversation_participants(sender_id, new_conversation_res['uuid'])
            Conversations.add_conversation_participants(recipient_id, new_conversation_res['uuid'])

            # join current client to room
            join_room(conversation_room)


            # request recipient to join room and send a message
            # requests are addressed directly to recipients personal room
            emit("request_join", conversation_room, to=recipient_uuid)
            emit("conversation_created", conversation_room, to=sender_uuid)
            print("requested recipient to join", conversation_room)

            room_destination = recipient_uuid

            # note : personal room basing off of user uuid is not secure as it is exposed in the frontend
        else : 
            conversation_room = conversation_res['uuid']
            print('already have conversation', conversation_room)
    else :
        print("already have passed conversation", conversation_room)

    new_message = Messages(content=message, conversation_uuid=conversation_room, sender_id=sender_id)
    res = new_message.add()
    payload = {
        "id" : res["id"],
        "sender_username" : sender_username,
        "sender": sender_obj,
        "content": message,
        "conversation_uuid" : res["conversation_uuid"],
        "created_at" : str(res["created_at"])
    } 

    emit(f"new_message_{room_destination}", payload, to=room_destination)
    
    emit(f"{recipient_uuid}_new_message", payload, to=recipient_uuid)
    Conversations.patch_last_read_id(res["id"], sender_id, conversation_room)




@socketio.on("join")
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    print(username, 'has entered', room)



@socketio.on("join_rooms") 
def join_rooms(username) :
    # this function assumes that client passed a valid user
    # and that user is authenticated

    user_id_res = Users.get_id_uuid_by_username(username)
    
    current_user_id = user_id_res['id']
    rooms = Conversations.get_all_conversation_rooms(current_user_id, limit=-1) 
    for room in rooms:
        print('user', current_user_id, 'joined', room['uuid'])
        join_room(room['uuid'])

@socketio.on("read_message") 
def read_message(data) :
    user_username = data['username']
    conversation_uuid = data['conversation_uuid']
    message_id = data['message_id']


    user_res = Users.get_id_uuid_by_username(user_username)

    user_id = user_res['id']

    Conversations.patch_last_read_id(message_id, user_id, conversation_uuid)


