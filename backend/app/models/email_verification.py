import secrets
from ..database import get_db
import psycopg2.extras

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
    def verify_code(cls, code, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        DELETE FROM email_verifications
        WHERE user_id = %s
        AND code = %s
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
    def check_sent_code_request_is_available(cls, current_user_id, cooldown_minutes) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = f"""
        SELECT
        (NOW() >  created_at + INTERVAL '{cooldown_minutes} minutes') AS is_available
        FROM 
        email_verifications
        WHERE user_id = %s
        """

        cursor.execute(sql, (current_user_id, ))
        result = cursor.fetchone()


        db.commit()
        cursor.close()

        if result is None :
            return True

        return result['is_available']