
from ..database import get_db

class PlantTags() :
    def __init__(self, id=None,plant_id=None,post_id=None, created_at=None,  ) :
        self.id=id
        self.plant_id=plant_id
        self.post_id=post_id
        self.created_at=created_at
    
    def add(self) :
        db = get_db()
        cursor = db.cursor()

        sql = "INSERT INTO plant_tags(plant_id, post_id) VALUES (%s, %s) ON CONFLICT DO NOTHING "
        cursor.execute(sql, (self.plant_id, self.post_id)) 
        db.commit()
        cursor.close()

    @classmethod
    def delete_all_of_post(cls, post_id) :
        db = get_db()
        cursor = db.cursor()

        sql = "DELETE FROM plant_tags WHERE post_id = %s"
        cursor.execute(sql, (post_id,)) 
        db.commit()
        cursor.close()


