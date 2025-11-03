from flask_login import UserMixin
from ..database import get_db
import psycopg2.extras
import hashlib

class Users(UserMixin) :
    def __init__(self,  uuid=None, username=None, email=None, password=None, created_at=None, pfp_url=None):
        self.uuid = uuid
        self.username = username
        self.email = email
        self.password = password
        self.created_at = created_at
        self.pfp_url = pfp_url
    
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
        # does not include password
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
            created_at=result['created_at'],
            pfp_url=result['pfp_url']
        )

    @classmethod
    def get_for_auth(cls, username) :
        # includes password, used only for auth
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
            password=result['user_password'],
            created_at=result['created_at'],
            pfp_url=result['pfp_url']
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
            created_at=result['created_at'],
            pfp_url=result['pfp_url']
        )

    @classmethod 
    def check_email_ditto(cls, email) :
        user = Users.get_by_email(email)

        return True if user else False

    @classmethod
    def get_by_id(cls, user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM users WHERE uuid= %s"

        cursor.execute(sql, (user_id,))
        result = cursor.fetchone()

        if not result :
            return None

        return cls(
            uuid=result['uuid'],
            username=result['username'],
            email=result['email'],
            created_at=result['created_at'],
            pfp_url=result['pfp_url']
        )

    def get_id(self) :
        return str(self.uuid)

    def check_password(self, password) : 
        password_hash = hashlib.md5(password.encode()).hexdigest()
        return password_hash == self.password
    
    def get_json(self) :
        return {
            'id':str(self.uuid),
            'username':self.username,
        }
    
    @classmethod
    def set_pfp(cls, uuid, pfp_url) :
        try: 
            db = get_db()
            cursor = db.cursor()

            sql="UPDATE users SET pfp_url = %s WHERE uuid = %s"
            cursor.execute(sql, (pfp_url, uuid))
            db.commit()
            cursor.close()

            return True
        except Exception as e:
            print(f"error setting pfp: {e}")
            return False