from ..database import get_db
import psycopg2.extras

class Diaries :
    def __init__(self, id=None, uuid=None, note=None, media_url=None, media_type=None, created_at=None, plant_id=None, user_id=None):
        self.id=id
        self.uuid=uuid
        self.note=note
        self.media_url=media_url
        self.media_type=media_type
        self.created_at=created_at
        self.plant_id=plant_id
        self.user_id=user_id
    
    def add(self) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """INSERT INTO diaries 
        (note, plant_id, user_id) 
        VALUES (%s, %s, %s)
        RETURNING uuid
        """
        cursor.execute(sql, (self.note, self.plant_id, self.user_id))
        
        uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()

        return uuid_res
    
    @classmethod
    def update_media(cls, diary_uuid, media_url, media_type) :
        db = get_db()
        cursor = db.cursor()

        sql = "UPDATE diaries SET media_url = %s, media_type = %s WHERE uuid = %s"
        cursor.execute(sql, (media_url, media_type, diary_uuid))

        db.commit()
        cursor.close()

    @classmethod
    def update(cls, diary_uuid, note, plant_id, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql=f"""
        UPDATE diaries
        SET 
        note = %s,
        plant_id = %s
        FROM plants
        WHERE diaries.uuid = %s AND diaries.user_id = %s 
        AND diaries.plant_id = plants.id
        RETURNING diaries.*, plants.nickname
        """
        cursor.execute(sql, (note, plant_id, diary_uuid, current_user_id))

        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result
    
    @classmethod
    def delete_diary(cls, diary_uuid, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "DELETE FROM diaries WHERE uuid = %s AND user_id = %s RETURNING *"
        cursor.execute(sql, (diary_uuid, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result