from ..database import get_db
import psycopg2.extras
from flask import jsonify

class Plants() :
    def __init__(self, id=None, uuid=None, nickname=None, description=None, picture_url=None, plant_type=None, created_at=None, user_id=None):
        self.id=id
        self.uuid=uuid
        self.nickname=nickname
        self.description=description
        self.picture_url=picture_url
        self.plant_type=plant_type
        self.created_at=created_at
        self.user_id=user_id
    
    def add(self) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql="""
        INSERT INTO plants
        (nickname, plant_description, plant_type_id, user_id)
        VALUES (%s, %s, %s, %s)
        RETURNING uuid
        """
        cursor.execute(sql, (self.nickname, 
                             self.description,
                             self.plant_type, 
                             self.user_id))
        uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()

        return uuid_res


    
    @classmethod
    def update_picture_url(cls, plant_uuid, picture_url) :
        db = get_db()
        cursor = db.cursor()

        sql = "UPDATE plants SET picture_url = %s WHERE uuid = %s"
        cursor.execute(sql, (picture_url, plant_uuid))

        db.commit()
        cursor.close()

    @classmethod 
    def check_plant_type_exists(cls, plant_type_id) :
        db = get_db()
        cursor = db.cursor()

        sql = "SELECT * FROM plant_types WHERE id = %s"
        cursor.execute(sql, (plant_type_id,))
        result = cursor.fetchone()
        if not result :
            return False

        return True