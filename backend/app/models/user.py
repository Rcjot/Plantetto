from flask_login import UserMixin
from ..database import get_db
import psycopg2.extras
import hashlib
from flask import jsonify

class Users(UserMixin) :
    def __init__(self, id=None, uuid=None, username=None, email=None, password=None, created_at=None, pfp_url=None, display_name=None):
        self.id = id
        self.uuid = uuid
        self.username = username
        self.email = email
        self.password = password
        self.created_at = created_at
        self.pfp_url = pfp_url
        self.display_name = display_name
    
    def add(self) :
        db = get_db()
        cursor = db.cursor()

        password_hash = hashlib.md5(self.password.encode()).hexdigest()

        sql = "INSERT INTO users(username, email, user_password) VALUES (%s, %s, %s)"
        cursor.execute(sql, (self.username, self.email, password_hash))

        db.commit()
        cursor.close()
    
    @classmethod 
    def explore(cls, limit, search, cursor_timestamp, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        search = "%" + search + "%"

        # fix: include 'created_at' in the SELECT so cursor works
        sql = """
        SELECT
            uuid,
            username,
            display_name,
            pfp_url,
            u.created_at,
            (f.following_id IS NOT NULL) AS is_following
        FROM users u
        LEFT JOIN follows f
            ON f.follower_id = %s
            AND f.following_id = u.id
        """
        params = [current_user_id]

        if cursor_timestamp:
            sql +=  """
                    WHERE u.created_at < %s 
                    AND u.id != %s AND (username ILIKE %s OR display_name ILIKE %s)
                    ORDER BY u.created_at DESC
                    LIMIT %s
                    """
            params += [cursor_timestamp]
        else: 
            sql += """
                    WHERE u.id != %s AND (username ILIKE %s OR display_name ILIKE %s)
                    ORDER BY u.created_at DESC
                    LIMIT %s
                    """
        params += [current_user_id, search, search, limit+1]

        cursor.execute(sql, params)
        users = cursor.fetchall()
        cursor.close()
        return users



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
            pfp_url=result['pfp_url'],
            display_name=result['display_name'],
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
            id=result['id'],
            uuid=result['uuid'],
            username=result['username'],
            email=result['email'],
            password=result['user_password'],
            created_at=result['created_at'],
            pfp_url=result['pfp_url'],
            display_name=result['display_name'],

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
            pfp_url=result['pfp_url'],
            display_name=result['display_name'],
        )

    @classmethod 
    def check_email_ditto(cls, email) :
        user = Users.get_by_email(email)

        return True if user else False

    @classmethod
    def get_by_id(cls, user_id) :
        # used by user_loader
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM users WHERE id= %s"

        cursor.execute(sql, (user_id,))
        result = cursor.fetchone()

        if not result :
            return None

        return cls(
            id=result['id'],
            uuid=result['uuid'],
            username=result['username'],
            email=result['email'],
            created_at=result['created_at'],
            pfp_url=result['pfp_url'],
            display_name=result['display_name'],
        )

    def get_id(self) :
        return str(self.id)
    
    def get_uuid(self) :
        return str(self.uuid)

    def check_password(self, password) : 
        password_hash = hashlib.md5(password.encode()).hexdigest()
        return password_hash == self.password
    
    def get_json(self) :
        return {
            'id':str(self.uuid),
            'username':self.username,
            'pfp_url':self.pfp_url,
            'display_name':self.display_name
        }
    
    @classmethod
    def set_pfp(cls, id, pfp_url) :
        try: 
            db = get_db()
            cursor = db.cursor()

            sql="UPDATE users SET pfp_url = %s WHERE id = %s"
            cursor.execute(sql, (pfp_url, id))
            db.commit()
            cursor.close()
            
            return True
        except Exception as e:
            print(f"error setting pfp: {e}")
            return False
        
    @classmethod 
    def update_profile(cls, id, display_name=None, pfp_url=None):
        try:
            db = get_db()
            cursor = db.cursor()
            
            updates = []
            params = []
            
            if display_name is not None:
                updates.append("display_name = %s")
                params.append(display_name)
            
            if pfp_url is not None:
                updates.append("pfp_url = %s")
                params.append(pfp_url)
            
            if not updates:
                return True
            
            params.append(id)
            sql = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
            
            cursor.execute(sql, tuple(params))
            db.commit()
            cursor.close()
            
            return True
        except Exception as e:
            print(f"error updating profile: {e}")
            return False

    @classmethod
    def get_id_uuid_by_username(cls, username) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT id, uuid FROM users WHERE username = %s"

        cursor.execute(sql, (username,))
        result = cursor.fetchone()

        if not result :
            return None

        return result
