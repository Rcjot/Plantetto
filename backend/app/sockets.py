from flask_socketio import SocketIO, send, join_room, leave_room, emit
from . import socketio
from flask_login import login_user, login_required, current_user, logout_user
from .models.conversation import Conversations
from .models.message import Messages
from .models.user import Users
from .models.notifications import Notifications
import json
import datetime

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
    # can be considered as notification.

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

    user_id_uuid_res = Users.get_id_uuid_by_username(username)
    
    current_user_id = user_id_uuid_res['id']
    current_user_uuid = user_id_uuid_res['uuid']
    rooms = Conversations.get_all_conversation_rooms(current_user_id, limit=-1) 
    for room in rooms:
        print('user', current_user_id, 'joined', room['uuid'])
        join_room(room['uuid'])

    # we create notif settings table

    join_room(f"{current_user_uuid}_follow")

@socketio.on("read_message") 
def read_message(data) :
    user_username = data['username']
    conversation_uuid = data['conversation_uuid']
    message_id = data['message_id']


    user_res = Users.get_id_uuid_by_username(user_username)

    user_id = user_res['id']

    Conversations.patch_last_read_id(message_id, user_id, conversation_uuid)


@socketio.on("follow")
def notify_follow(data) :
    # follower user emits this event

    follower_user = data['follower']
    following_user = data['following']

    follower_res = Users.get_id_uuid_by_username(follower_user['username'])
    follower_id = follower_res['id']



    following_res = Users.get_id_uuid_by_username(following_user['username'])
    following_id = following_res['id']
    following_uuid = following_res['uuid']

    payload = json.dumps({
        "actor" : follower_user,
    })

    new_notif = Notifications(user_id=following_id,
                              actor_id=follower_id,
                              notification_type="follow", 
                              payload=payload)
    new_notif_payload = new_notif.add()
    new_notif_payload['created_at'] = new_notif_payload['created_at'].isoformat()

    print(new_notif_payload)

    emit(f"followed", new_notif_payload, to=following_uuid)
    
    
"""

note :
    we specify uuids in some events because it is to distinguish 
    the event. 

    Rooms are only there for the user to listen to, user does not automatically
    distinguish events by the room it came from, it just listens to events
    from joined rooms.

rooms 
{user_uuid} , this room is user's personal room, will always listen to these
    emitted events :
        {sender_uuid}_new_message 
            : is used in updating chat list for recent messages
        request_join
            : is used when a new conversation is initiated
            : user is the recipient
        conversation_created
            : is used as feedback when a new conversation is created
            : user is the sender
        followed
            : when other user has followed current user, emit follow event

{room_uuid} , room of conversation
    emitted events : 
        new_message_{room_uuid} 
            : is used to update conversation real time

--            ---
{user_uuid}_follow , name of room is same as emitted event
    : is used to notify user for follows
{user_uuid}_post
    : notifies user for posts from following user
...

"""

    
 
