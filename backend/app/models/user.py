from flask_login import UserMixin
from ..database import get_db
import psycopg2.extras
import hashlib

class Users(UserMixin) :
    def __init__(self,  uuid=None, username=None, email=None, password=None, created_at=None):
        self.uuid = uuid
        self.username = username
        self.email = email
        self.password = password
        self.created_at = created_at
    
    def add(self) :
        db = get_db()
        cursor = db.cursor()

        password_hash = hashlib.md5(self.password.encode()).hexdigest()

        sql = "INSERT INTO users(username, email, user_password) VALUES (%s, %s, %s)"
        cursor.execute(sql, (self.username, self.email, password_hash))

        db.commit()
        cursor.close()

    @classmethod
    def get_by_username(cls, username):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM users WHERE username = %s"

        cursor.execute(sql, (username,))
        result = cursor.fetchone()

        if not result :
            return None

        return cls(
            uuid=result['uuid'],
            username=result['username'],
            email=result['email'],
            created_at=result['created_at']
        )

    @classmethod 
    def check_username_ditto(cls, username) :
        user = Users.get_by_username(username)

        return True if user else False
        
    @classmethod
    def get_by_email(cls, email) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM users WHERE email= %s"

        cursor.execute(sql, (email,))
        result = cursor.fetchone()

        if not result :
            return None

        return cls(
            uuid=result['uuid'],
            username=result['username'],
            email=result['email'],
            created_at=result['created_at']
        )

    @classmethod 
    def check_email_ditto(cls, email) :
        user = Users.get_by_email(email)

        return True if user else False