from ..database import get_db
import psycopg2.extras

class GuidesImages() :
    def __init__(self, id=None, uuid=None,image_url=None, guide_id=None, created_at=None):
        self.id=id
        self.uuid=uuid
        self.image_url=image_url
        self.guide_id=guide_id
        self.created_at=created_at
    
    def add(self) : 
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "INSERT INTO guides_images (guide_id) VALUES (%s) RETURNING uuid"
        cursor.execute(sql, (self.guide_id,))

        uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()

        return uuid_res    
        
    @classmethod
    def update_image(cls, guides_image_uuid, image_url) :
        db = get_db()
        cursor = db.cursor()

        sql = "UPDATE guides_images SET image_url = %s WHERE uuid = %s"
        cursor.execute(sql, (image_url, guides_image_uuid))

        db.commit()
        cursor.close()
    
    @classmethod 
    def delete_unused_images(cls, image_urls, guide_id) :
        db = get_db()
        cursor = db.cursor()
        if (image_urls) :
            sql = "UPDATE guides_images SET is_used = TRUE WHERE guide_id = %s AND image_url IN %s"
            cursor.execute(sql, (guide_id, tuple(image_urls),))
            sql = "DELETE FROM guides_images WHERE guide_id = %s AND image_url NOT IN %s RETURNING uuid"
            cursor.execute(sql, (guide_id, tuple(image_urls),))
        else :
            sql = "DELETE FROM guides_images WHERE guide_id = %s RETURNING uuid"
            cursor.execute(sql, (guide_id,))
        result = cursor.fetchall()

        db.commit()
        cursor.close()
        return result
    
    @classmethod
    def delete_all_unused_images(cls) :
        db = get_db()
        cursor = db.cursor()

        sql = """DELETE FROM guides_images gi
         USING guides g
         WHERE 
            gi.guide_id = g.id
            AND gi.is_used = FALSE 
            AND gi.created_at < NOW() - INTERVAL '7 days' 
         RETURNING gi.uuid AS image_uuid, g.uuid AS guide_uuid"""
        cursor.execute(sql)
        result = cursor.fetchall()
        db.commit()
        cursor.close()

        return result

    @classmethod
    def check_guide_has_images(cls, guide_id) :
        db = get_db()
        cursor = db.cursor()

        sql = """
        SELECT * FROM guides_images
        WHERE guide_id = %s
        """
        cursor.execute(sql, (guide_id,) )
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result    
