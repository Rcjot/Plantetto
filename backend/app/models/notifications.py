from ..database import get_db
import psycopg2.extras

class Notifications() :
    def __init__(self, id=None, notification_type=None, is_read=None, payload=None, user_id=None, actor_id=None, created_at=None, entity_id=None) :
        self.id=id
        self.notification_type=notification_type
        self.is_read=is_read
        self.payload=payload
        self.user_id=user_id
        self.actor_id=actor_id
        self.created_at=created_at
        self.entity_id=entity_id

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
    def get_notification_with_entity_and_type(cls, current_user_id, entity_uuid, notif_type) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        if notif_type == "post" or notif_type == "comment_post" :
            x = "posts"
        elif notif_type == "guide" or notif_type == "comment_guide" :
            x = "guides"
        elif notif_type == "diary" : 
            x = "diaries"

        # likes and follows notifs are not here, because they are passed directly when notifying.
    

        sql = f"""
                SELECT * 
                FROM notifications n
                JOIN {x} x ON n.entity_id = x.id
                WHERE n.user_id = %s
                AND x.uuid = %s
                AND n.notification_type = %s
                """

        cursor.execute(sql, (current_user_id, entity_uuid, notif_type, ) )
        print(sql, current_user_id, entity_uuid, notif_type)

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
    def get_notifications(cls, current_user_id, cursor_id=None, limit=None) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = """
        SELECT 
        *
        FROM notifications
        WHERE user_id = %s
        AND is_read = FALSE
        """
        params = [current_user_id]
        if cursor_id :
            sql += """
                    AND id < %s
                    ORDER BY created_at DESC
                    LIMIT %s
                   """
            params += [cursor_id]
        else : 
            sql += """
                    ORDER BY created_at DESC
                    LIMIT %s
                   """
            
        params += [limit+1]
        cursor.execute(sql, params )

        notifications = cursor.fetchall()

        db.commit()
        cursor.close()
    
        return notifications


    @classmethod
    def mark_all_read(cls, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = """
        UPDATE
        notifications
        SET is_read = TRUE
        WHERE user_id = %s
        """
        cursor.execute(sql, (current_user_id,) )


        db.commit()
        cursor.close()
    
    @classmethod
    def generate_notifications_post(cls, entity_id, caption, actor, entity_uuid, actor_id ) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        payload = {
            "content": caption,
            "actor" : actor,
            "entity_uuid" : entity_uuid
        }

        sql = """
        INSERT INTO notifications
        (notification_type, entity_id, payload, user_id, actor_id)
        SELECT 
        'post',
        %s,
        %s,
        follower_id,
        %s
        FROM follows 
        WHERE following_id = %s
        AND notify_post = TRUE
        RETURNING payload
        """

        cursor.execute(sql, (entity_id, psycopg2.extras.Json(payload), actor_id, actor_id))

        payload = cursor.fetchone()

        db.commit()
        cursor.close()

        return payload
    
    @classmethod
    def generate_notifications_guide(cls, entity_id, title, actor, entity_uuid, actor_id ) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        payload = {
            "content": title,
            "actor" : actor,
            "entity_uuid" : entity_uuid
        }

        sql = """
        INSERT INTO notifications
        (notification_type, entity_id, payload, user_id, actor_id)
        SELECT 
        'guide',
        %s,
        %s,
        follower_id,
        %s
        FROM follows 
        WHERE following_id = %s
        AND notify_guide = TRUE
        RETURNING payload
        """

        cursor.execute(sql, (entity_id, psycopg2.extras.Json(payload), actor_id, actor_id))

        payload = cursor.fetchone()

        db.commit()
        cursor.close()

        return payload

    @classmethod
    def generate_notifications_diary(cls, entity_id, note, actor, entity_uuid, actor_id ) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        payload = {
            "content": note,
            "actor" : actor,
            "entity_uuid" : entity_uuid
        }

        sql = """
        INSERT INTO notifications
        (notification_type, entity_id, payload, user_id, actor_id)
        SELECT 
        'diary',
        %s,
        %s,
        follower_id,
        %s
        FROM follows 
        WHERE following_id = %s
        AND notify_guide = TRUE
        RETURNING payload
        """

        cursor.execute(sql, (entity_id, psycopg2.extras.Json(payload), actor_id, actor_id))

        payload = cursor.fetchone()

        db.commit()
        cursor.close()

        return payload
    
    @classmethod
    def generate_notification_comment(cls, entity_id, content, actor, entity_uuid, user_id,  actor_id, notification_type) :
        # function used for notifications like
            # comments
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        payload = {
            "content": content,
            "actor" : actor,
            "entity_uuid" : entity_uuid
        }

        sql = """
        INSERT INTO notifications
        (notification_type, entity_id, payload, user_id, actor_id)
        SELECT 
        %s,
        %s,
        %s,
        %s,
        %s
        RETURNING payload
        """

        cursor.execute(sql, (notification_type, entity_id, psycopg2.extras.Json(payload), user_id, actor_id))

        payload = cursor.fetchone()

        db.commit()
        cursor.close()

        return payload
    
    def add_likes_notif(self) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = """
        INSERT INTO notifications
        (notification_type, payload, user_id, actor_id, entity_id)
        VALUES(%s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING
        RETURNING id, notification_type, is_read, payload, user_id, created_at
        """
        cursor.execute(sql, (self.notification_type, self.payload, self.user_id, self.actor_id, self.entity_id))

        id_res = cursor.fetchone()
        
        if id_res is None :
            # upsert duplicate notifications for follows
            sql = """
            UPDATE notifications
            SET created_at = NOW(),
            is_read = FALSE
            WHERE 
            notification_type = %s
            AND user_id = %s
            AND actor_id = %s
            AND entity_id = %s
            
            RETURNING id, notification_type, is_read, payload, user_id, created_at
            """
            cursor.execute(sql, (self.notification_type, self.user_id, self.actor_id, self.entity_id))

            id_res = cursor.fetchone()

        db.commit()
        cursor.close()
    
        return id_res

    def add(self):
        # for types with no content,
            # likes and follows
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = """
        INSERT INTO notifications
        (notification_type, payload, user_id, actor_id)
        VALUES(%s, %s, %s, %s)
        ON CONFLICT DO NOTHING
        RETURNING id, notification_type, is_read, payload, user_id, created_at
        """
        cursor.execute(sql, (self.notification_type, self.payload, self.user_id, self.actor_id))

        id_res = cursor.fetchone()
        
        if id_res is None :
            # upsert duplicate notifications for follows
            sql = """
            UPDATE notifications
            SET created_at = NOW(),
            is_read = FALSE
            WHERE 
            notification_type = %s
            AND user_id = %s
            AND actor_id = %s
            RETURNING id, notification_type, is_read, payload, user_id, created_at
            """
            cursor.execute(sql, (self.notification_type, self.user_id, self.actor_id))

            id_res = cursor.fetchone()

        db.commit()
        cursor.close()
    
        return id_res
    