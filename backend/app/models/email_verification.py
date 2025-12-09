import secrets
from ..database import get_db
import psycopg2.extras
from .user import Users
import hashlib

class EmailVerifications :
    def __init__(self):
        pass
    
    @classmethod
    def generate_token(cls, current_user_id) :
        secret_code = f"{secrets.randbelow(10**6):06d}"
        expires_in_minutes = 5


        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = f"""
        INSERT INTO email_verifications
        (user_id, code, expires_at)
        VALUES (%s, %s, NOW() + INTERVAL '{expires_in_minutes} minutes')
        ON CONFLICT (user_id) 
        DO UPDATE SET
            code = EXCLUDED.code,
            expires_at = EXCLUDED.expires_at,
            created_at = NOW()
        """

        cursor.execute(sql, (current_user_id, secret_code))

        db.commit()
        cursor.close()

        token = {
            "secret_code" : secret_code,
            "expires_in_minutes" : expires_in_minutes 
        }

        return token
    
    @classmethod
    def generate_token_change_password(cls, current_user_id, new_password) :
        secret_code = f"{secrets.randbelow(10**6):06d}"
        expires_in_minutes = 5

        password_hash = hashlib.md5(new_password.encode()).hexdigest()


        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = f"""
        INSERT INTO email_verifications
        (user_id, 
        code, 
        expires_at, 
        verification_type,
        verification_data
        )
        VALUES (
        %s,
        %s,
        NOW() + INTERVAL '{expires_in_minutes} minutes',
        'password',
        %s
        )
        ON CONFLICT (user_id, verification_type) 
        DO UPDATE SET
            code = EXCLUDED.code,
            expires_at = EXCLUDED.expires_at,
            created_at = NOW()
        """

        cursor.execute(sql, (current_user_id, secret_code, password_hash))

        db.commit()
        cursor.close()

        token = {
            "secret_code" : secret_code,
            "expires_in_minutes" : expires_in_minutes 
        }

        return token
    
    @classmethod 
    def verify_code_password(cls, code, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        DELETE FROM email_verifications
        WHERE user_id = %s
        AND code = %s
        AND verification_type = 'password'
        AND expires_at > NOW()
        RETURNING verification_data
        """

        cursor.execute(sql, (current_user_id, code))

        result = cursor.fetchone()

        if result :
            verify_sql = """
                UPDATE users 
                SET user_password = %s
                WHERE id = %s
                """
            cursor.execute(verify_sql, (result['verification_data'], current_user_id,))


        db.commit()
        cursor.close()


        if result is None :
            return False
        else :
            return True

    @classmethod
    def verify_code(cls, code, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        DELETE FROM email_verifications
        WHERE user_id = %s
        AND code = %s
        AND verification_type = 'verify'
        AND expires_at > NOW()
        RETURNING *
        """

        cursor.execute(sql, (current_user_id, code))

        result = cursor.fetchone()

        if result :
            verify_sql = """
                UPDATE users 
                SET email_verified = TRUE
                WHERE id = %s
                """
            cursor.execute(verify_sql, (current_user_id,))


        db.commit()
        cursor.close()


        if result is None :
            return False
        else :
            return True
    
    @classmethod
    def check_sent_code_request_is_available(cls, current_user_id, cooldown_minutes, verification_type) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = f"""
        SELECT
        (NOW() >  created_at + INTERVAL '{cooldown_minutes} minutes') AS is_available
        FROM 
        email_verifications
        WHERE user_id = %s
        AND verification_type = %s
        """

        cursor.execute(sql, (current_user_id, verification_type))
        result = cursor.fetchone()


        db.commit()
        cursor.close()

        if result is None :
            return True

        return result['is_available']

    @classmethod 
    def check_has_available_code(cls, current_user_id, verification_type) :
        try :
            db = get_db()
            cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

            sql = f"""
            SELECT
            (expires_at > NOW()) AS has_available
            FROM 
            email_verifications
            WHERE user_id = %s
            AND verification_type = %s
            """

            cursor.execute(sql, (current_user_id, verification_type))
            result = cursor.fetchone()


            db.commit()
            cursor.close()


            return result['has_available']
        except :
            return False