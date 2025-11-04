from ..database import get_db
import psycopg2.extras

class Posts() :
    def __init__(self, id=None, uuid=None, caption=None, created_at=None, user_id=None) :
        self.id = id
        self.uuid = uuid
        self.caption = caption
        self.created_at = created_at
        self.user_id = user_id
    
    def add(self) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = "INSERT INTO posts(caption, user_id) VALUES(%s, %s) RETURNING id, uuid"
        cursor.execute(sql, (self.caption, self.user_id))

        id_uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()
    

        return id_uuid_res