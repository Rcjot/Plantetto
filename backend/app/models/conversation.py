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
    
    @classmethod
    def get_conversation_with_user(cls, current_user_id, recipient_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT
            c.uuid,
            JSON_BUILD_OBJECT (
                'id', u.uuid,
                'pfp_url', u.pfp_url,
                'username', u.username,
                'display_name', u.display_name
            ) AS recipient,
            (SELECT
                JSON_BUILD_OBJECT(
                    'id', m.id,
                    'content', m.content,
                    'created_at', m.created_at,
                    'sender', JSON_BUILD_OBJECT(
                        'id', sender.uuid,
                        'pfp_url', sender.pfp_url,
                        'username', sender.username,
                        'display_name', sender.display_name
                    ),
                    'current_user_is_sender', (sender.id = %s)
                )
             FROM messages m
             JOIN users sender ON sender.id = m.sender_id
             WHERE conversation_uuid = c.uuid     
             ORDER BY m.created_at DESC
             LIMIT 1
            ) AS recent_message,
            cp1.last_read_message_id
        FROM conversations c
        JOIN conversation_participants cp1
            ON cp1.conversation_uuid = c.uuid AND cp1.user_id = %s 
        JOIN conversation_participants cp2
            ON cp2.conversation_uuid = c.uuid AND cp2.user_id = %s
        JOIN users u
            ON cp2.user_id = u.id 
        """
        
        cursor.execute(sql,(current_user_id, current_user_id, recipient_id)) 
        result = cursor.fetchone()

        db.commit()
        cursor.close()
    
        return result

    @classmethod
    def get_all_conversation_rooms(cls, current_user_id, search=None, cursor_timestamp=None, limit=None, is_all=None) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        is_all = True if is_all == "true" else False
        
        sql = """
        SELECT
            c.uuid,
            JSON_BUILD_OBJECT (
                'id', u.uuid,
                'pfp_url', u.pfp_url,
                'username', u.username,
                'display_name', u.display_name
            ) AS recipient,
            (SELECT
                JSON_BUILD_OBJECT(
                    'id', m.id,
                    'content', m.content,
                    'created_at', m.created_at,
                    'sender', JSON_BUILD_OBJECT(
                        'id', sender.uuid,
                        'pfp_url', sender.pfp_url,
                        'username', sender.username,
                        'display_name', sender.display_name
                    ),
                    'current_user_is_sender', (sender.id = %s)
                )
             FROM messages m
             JOIN users sender ON sender.id = m.sender_id
             WHERE conversation_uuid = c.uuid     
             ORDER BY m.created_at DESC
             LIMIT 1
            ) AS recent_message,
            (SELECT
                m.created_at
             FROM messages m
             JOIN users sender ON sender.id = m.sender_id
             WHERE conversation_uuid = c.uuid     
             ORDER BY m.created_at DESC
             LIMIT 1
            ) AS recent_message_date,
            cp1.last_read_message_id
        FROM conversations c
        JOIN conversation_participants cp1
            ON cp1.conversation_uuid = c.uuid AND cp1.user_id = %s 
        JOIN conversation_participants cp2
            ON cp2.conversation_uuid = c.uuid AND cp2.user_id != %s
        JOIN users u
            ON cp2.user_id = u.id 
        """
        params = [current_user_id, current_user_id, current_user_id]

        if limit == -1 :
            sql +=  """
                    ORDER BY recent_message_date DESC
                    """
        else : 
            search = "%" + search + "%"
            if not is_all :
                sql += """
                        WHERE (u.username ILIKE %s OR u.display_name ILIKE %s)
                        AND (SELECT 
                                m.id
                            FROM messages m
                            JOIN users sender ON sender.id = m.sender_id
                            WHERE conversation_uuid = c.uuid     
                            ORDER BY m.created_at DESC
                            LIMIT 1
                            ) != cp1.last_read_message_id
                       """
                params += [search, search]
            else :
                sql +=  """
                        WHERE (u.username ILIKE %s OR u.display_name ILIKE %s)
                        """
                params += [search, search]
        
            if cursor_timestamp :
                # tiring to make this better, 
                # recent_message_date cant be compared as it is not a table column
                sql +=  """
                        AND (SELECT
                                m.created_at
                            FROM messages m
                            JOIN users sender ON sender.id = m.sender_id
                            WHERE conversation_uuid = c.uuid     
                            ORDER BY m.created_at DESC
                            LIMIT 1
                            ) < %s
                        ORDER BY recent_message_date DESC
                        LIMIT %s
                        """
                params += [cursor_timestamp, limit+1]
            else :
                sql +=  """
                        ORDER BY recent_message_date DESC
                        LIMIT %s
                        """
                params += [limit+1]

        cursor.execute(sql, params) 
        result = cursor.fetchall()

        db.commit()
        cursor.close()
    
        return result
    
    @classmethod
    def get_conversation_by_uuid(cls, conversation_uuid, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT
            c.uuid,
            JSON_BUILD_OBJECT (
                'id', u.uuid,
                'pfp_url', u.pfp_url,
                'username', u.username,
                'display_name', u.display_name
            ) AS recipient,
            (SELECT
                JSON_BUILD_OBJECT(
                    'id', m.id,
                    'content', m.content,
                    'created_at', m.created_at,
                    'sender', JSON_BUILD_OBJECT(
                        'id', sender.uuid,
                        'pfp_url', sender.pfp_url,
                        'username', sender.username,
                        'display_name', sender.display_name
                    ),
                    'current_user_is_sender', (sender.id = %s)
                )
             FROM messages m
             JOIN users sender ON sender.id = m.sender_id
             WHERE conversation_uuid = c.uuid     
             ORDER BY m.created_at DESC
             LIMIT 1
            ) AS recent_message,
            cp1.last_read_message_id
        FROM conversations c
        JOIN conversation_participants cp1
            ON cp1.conversation_uuid = c.uuid AND cp1.user_id = %s
        JOIN conversation_participants cp2
            ON cp2.conversation_uuid = c.uuid AND cp2.user_id != cp1.user_id
        JOIN users u
            ON cp2.user_id = u.id 
        WHERE c.uuid = %s
        """
        
        cursor.execute(sql,(current_user_id, current_user_id, conversation_uuid)) 
        result = cursor.fetchone()

        db.commit()
        cursor.close()
        
        if result is None :
            return None
    
        return result


    @classmethod
    def get_all_conversation_participants(cls, conversation_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT
            u1.uuid,
            u1.pfp_url,
            u1.username,
            u1.display_name,
            cp1.last_read_message_id
        FROM conversations c
        JOIN conversation_participants cp1
            ON cp1.conversation_uuid = c.uuid 
        JOIN users u1
            ON cp1.user_id = u1.id
        WHERE c.uuid = %s
        """

        cursor.execute(sql,(conversation_uuid,)) 
        result = cursor.fetchall()

        db.commit()
        cursor.close()
    
        return result
    
    @classmethod
    def patch_last_read_id(cls, message_id, user_id, conversation_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        UPDATE conversation_participants
        SET last_read_message_id = %s
        WHERE user_id = %s AND conversation_uuid = %s
        """
        cursor.execute(sql, (message_id, user_id, conversation_uuid))
        db.commit()
        cursor.close()