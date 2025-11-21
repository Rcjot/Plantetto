from flask_socketio import SocketIO, send
from . import socketio

@socketio.on("connect") 
def handle_connect() :
    print("Client connected!")

@socketio.on('message')
def handle_message(data):
    print('received message: ', data)
