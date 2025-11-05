from ..database import get_db

class Media() :
    def __init__(self, id=None, media_url=None, media_order=None, media_type=None, created_at=None, post_id=None, width=None, height=None) :
        self.id=id
        self.media_url=media_url
        self.media_order=media_order
        self.media_type=media_type
        self.created_at=created_at
        self.post_id=post_id
        self.width=width
        self.heigth=height
    
    def add(self) :
        db = get_db()
        cursor = db.cursor()

        sql = "INSERT INTO media(media_url, media_order, media_type, post_id, width, height) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (self.media_url, self.media_order, self.media_type, self.post_id, self.width, self.heigth))

        db.commit()
        cursor.close()
