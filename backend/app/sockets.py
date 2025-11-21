from flask_socketio import SocketIO, send, join_room, leave_room
from . import socketio
from flask_login import login_user, login_required, current_user, logout_user

@socketio.on("connect") 
def handle_connect() :
    print("Client connected!")

@socketio.on('message')
def handle_message(data):
    print('received message: ', data)


@socketio.on("join")
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    print(username, 'has entered', room)
    send(username + ' has entered the room.', to=room)



@socketio.on("join_rooms") 
def join_rooms() :
    if not current_user.is_authenticated : 
        return
    # fetch all rooms in db, 
    # for room in fetched_rooms : join_room(room)
