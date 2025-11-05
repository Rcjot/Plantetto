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
    def all(cls, username, search, plant_type_id, limit, offset) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        plant_query = """
        SELECT 
            plants.uuid AS plant_uuid,
            plants.nickname,
            plants.plant_description AS description,
            plants.picture_url,
            plants.created_at,
            plant_types.plant_name AS plant_type,
            JSON_BUILD_OBJECT(
                'id', users.uuid,
                'pfp_url', users.pfp_url,
                'username', users.username,
                'display_name', users.display_name
            ) AS owner
        """

        meta_data_query = """
        SELECT COUNT(*) OVER() AS result_count,
            (SELECT COUNT(*) FROM plants) AS total_count 
        """    
    
        sql = """
        FROM plants
        JOIN users ON plants.user_id = users.id
        JOIN plant_types ON plants.plant_type_id = plant_types.id
        WHERE users.username = %s
        AND plants.nickname ILIKE %s
        """
        search = "%" + search + "%"
        params = [username, search]
        if (plant_type_id is not None) :
            sql += " AND plants.plant_type_id =%s"
            params.extend([plant_type_id])
        sql+= " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cursor.execute(plant_query + sql, params)
        user_plants = cursor.fetchall()
        cursor.execute(meta_data_query + sql, params)
        meta_data = cursor.fetchone()

        cursor.close()

        if (meta_data is None) :
            meta_data = {
                "total_count" : 0,
                "result_count" : 0
            }

        return ({
            "user_plants" : user_plants,
            "meta_data" : meta_data
        })

    @classmethod 
    def get_plant(cls, plant_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT 
            plants.uuid AS plant_uuid,
            plants.nickname,
            plants.plant_description,
            plants.picture_url,
            plants.created_at,
            plant_types.plant_name,
            JSON_BUILD_OBJECT(
                'id', users.uuid,
                'pfp_url', users.pfp_url,
                'username', users.username,
                'display_name', users.display_name
            ) AS owner
        FROM plants
        JOIN users ON plants.user_id = users.id
        JOIN plant_types ON plants.plant_type_id = plant_types.id
        WHERE plants.uuid = %s
        """

        cursor.execute(sql, (plant_uuid,))
        result = cursor.fetchone()
        cursor.close()

        return result

    @classmethod
    def update(cls, plant_uuid, nickname, description, plant_type, current_user_id ) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql=f"""
        UPDATE plants
        SET 
        nickname = %s,
        plant_description = %s,
        plant_type_id = %s
        WHERE uuid = %s AND user_id = %s 
        RETURNING *
        """
        cursor.execute(sql, (nickname, description, plant_type, plant_uuid, current_user_id))

        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result
    
    @classmethod
    def update_picture_url(cls, plant_uuid, picture_url) :
        db = get_db()
        cursor = db.cursor()

        sql = "UPDATE plants SET picture_url = %s WHERE uuid = %s"
        cursor.execute(sql, (picture_url, plant_uuid))

        db.commit()
        cursor.close()
    
    @classmethod
    def delete_plant(cls, plant_uuid, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "DELETE FROM plants WHERE uuid = %s AND user_id = %s RETURNING *"
        cursor.execute(sql, (plant_uuid, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result
    
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

    @classmethod 
    def get_plant_types(cls) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM plant_types"

        cursor.execute(sql)
        result = cursor.fetchall()
        
        return result

    @classmethod 
    def check_user_plant_exists_by_id(cls, plant_id, user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "SELECT * FROM plants WHERE id = %s AND user_id = %s"
        cursor.execute(sql, (plant_id, user_id))
        result = cursor.fetchone()
        if not result :
            return False

        return True