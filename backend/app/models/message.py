from ..database import get_db
import psycopg2.extras

class Messages() :
    def __init__(self, id=None,content=None, sender_id=None, conversation_uuid=None, created_at=None) :
        self.id=id
        self.content=content
        self.sender_id=sender_id
        self.conversation_uuid=conversation_uuid
        self.created_at=created_at
    
    def add(self) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """INSERT INTO messages
        (content, sender_id, conversation_uuid) 
        VALUES (%s, %s, %s)
        RETURNING id
        """
        cursor.execute(sql, (self.content, self.sender_id, self.conversation_uuid))
        
        res = cursor.fetchone()

        db.commit()
        cursor.close()

        return res

    @classmethod
    def all_under_conversation(cls, current_user_id, conversation_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT
            m.content,
            m.created_at,
            JSON_BUILD_OBJECT(
                'id', sender.uuid,
                'pfp_url', sender.pfp_url,
                'username', sender.username,
                'display_name', sender.display_name
            ) AS sender,
            (sender.id = %s) AS current_user_is_sender
        FROM messages m
        JOIN users sender ON sender.id = m.sender_id
        WHERE conversation_uuid = %s        
        ORDER BY m.created_at ASC
        """
        cursor.execute(sql,(current_user_id, conversation_uuid,))
        
        res = cursor.fetchall()

        db.commit()
        cursor.close()

        return res