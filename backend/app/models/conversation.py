from ..database import get_db
import psycopg2.extras

class Conversations() :
    def __init__(self, uuid=None, created_at=None) :
        self.uuid=uuid
        self.created_at=created_at


    @classmethod
    def add_conversation(cls) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = "INSERT INTO conversations DEFAULT VALUES RETURNING uuid"
        cursor.execute(sql)

        id_uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()
    
        return id_uuid_res

    @classmethod
    def add_conversation_participants(cls, user_id, conversation_uuid):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = """INSERT INTO conversation_participants 
        (conversation_uuid, user_id )
        VALUES (%s, %s)
        RETURNING conversation_uuid"""
        cursor.execute(sql,( conversation_uuid, user_id)) 
        uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()
    
        return uuid_res

    @classmethod
    def check_conversation_exists(cls, user1_id, user2_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT uuid FROM conversations c
        JOIN conversation_participants cp1
            ON cp1.conversation_uuid = c.uuid AND cp1.user_id = %s 
        JOIN conversation_participants cp2 
            ON cp2.conversation_uuid = c.uuid AND cp2.user_id = %s
        """
        # this query is not scaleable for group chats/conversations
        

        cursor.execute(sql,( user1_id, user2_id)) 
        uuid_res = cursor.fetchone()

        if not uuid_res :
            return None

        db.commit()
        cursor.close()
    
        return uuid_res

        

