from ..database import get_db
import psycopg2.extras

class Notifications() :
    def __init__(self, id=None, notification_type=None, is_read=None, payload=None, user_id=None, created_at=None) :
        self.id=id
        self.notification_type=notification_type
        self.is_read=is_read
        self.payload=payload
        self.user_id=user_id
        self.created_at=created_at

    def add(self):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = """
        INSERT INTO notifications
        (notification_type, payload, user_id)
        VALUES(%s, %s, %s)
        RETURNING id, notification_type, is_read, payload, user_id, created_at
        """
        cursor.execute(sql, (self.notification_type, self.payload, self.user_id))

        id_res = cursor.fetchone()

        db.commit()
        cursor.close()
    
        return id_res

    @classmethod    
    def get_notification(cls, notif_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = """
        SELECT *
        FROM notifications
        WHERE id = %s
        """
        cursor.execute(sql, (notif_id, ) )

        result = cursor.fetchone()

        db.commit()
        cursor.close()
    
        return result
    @classmethod
    def patch_read(cls, notif_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = """
        UPDATE notifications
        set is_read = TRUE
        WHERE id = %s
        RETURNING id
        """
        cursor.execute(sql, (notif_id, ) )

        id_res = cursor.fetchone()

        db.commit()
        cursor.close()
    
        return id_res

    @classmethod 
    def get_notifications(cls, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = """
        SELECT 
        *
        FROM notifications
        WHERE user_id = %s
        AND is_read = FALSE
        """

        cursor.execute(sql, (current_user_id,) )

        notifications = cursor.fetchall()

        db.commit()
        cursor.close()
    
        return notifications


