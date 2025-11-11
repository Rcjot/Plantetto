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