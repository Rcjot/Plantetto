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
            print("requested recipient to join", conversation_room)
            emit("new_message", payload, to=recipient_uuid)
            # note : personal room basing off of user uuid is not secure as it is exposed in the frontend
            return
        else : 
            conversation_room = conversation_res['uuid']
            print('already have conversation', conversation_room)
    else :
        print("already have passed conversation", conversation_room)
    # add message entry in db
    # added entry should return details in message creation
    # include details in message payload
    # message -> message_res
    new_message = Messages(content=message, conversation_uuid=conversation_room, sender_id=sender_id)
    res = new_message.add()

    payload = {
        "sender_username" : sender_username,
        "sender": sender_obj,
        "content": message,
        "created_at" : str(res["created_at"])
    } 

    emit("new_message", payload, to=conversation_room)


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
    rooms = Conversations.get_all_conversation_rooms(current_user_id) 
    for room in rooms:
        print('user', current_user_id, 'joined', room['uuid'])
        join_room(room['uuid'])
