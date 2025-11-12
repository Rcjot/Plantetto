from ..database import get_db
import psycopg2.extras

class Guides() :
    def __init__(self, id=None, uuid=None,title=None, content=None, guide_status=None, created_at=None, plant_type_id=None, user_id=None ):
        self.id=id
        self.uuid=uuid
        self.title=title
        self.content=content
        self.guide_status=guide_status
        self.created_at=created_at
        self.plant_type_id=plant_type_id
        self.user_id=user_id
    
    def add(self) : 
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """INSERT INTO 
        guides
        (user_id)
        VALUES (%s)
        RETURNING uuid
        """
        cursor.execute(sql, (self.user_id))

        uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()

        return uuid_res
    

    @classmethod
    def patch_content(cls, guide_uuid, content, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql="""
        UPDATE guides
        SET 
        content = %s
        WHERE uuid = %s
        AND user_id = %s 
        RETURNING uuid, content, plant_type_id, user_id
        """
        cursor.execute(sql, (content, guide_uuid, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result    
    
    @classmethod
    def patch_meta(cls, guide_uuid, title, plant_type_id, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql="""
        UPDATE guides
        SET 
        title = %s,
        plant_type_id = %s
        WHERE uuid = %s
        AND user_id = %s 
        RETURNING uuid, content, plant_type_id, user_id
        """
        cursor.execute(sql, (title, plant_type_id,guide_uuid, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result    

    @classmethod 
    def get_user_board(cls, username) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT 
        guides.uuid, 
        guides.title, 
        guides.content, 
        guides.guide_status,
        JSON_BUILD_OBJECT(
            'id', plant_types.id,
            'plant_name', plant_types.plant_name
        ) AS plant_type,
        guides.created_at
        FROM guides
        JOIN users ON guides.user_id = users.id
        LEFT JOIN plant_types ON guides.plant_type_id = plant_types.id
        WHERE users.username = %s
        """

        cursor.execute(sql, (username,))
        guides = cursor.fetchall()

        cursor.close()

        return guides

    @classmethod
    def get_guide(cls, guide_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT guides.uuid, 
        guides.title, 
        guides.content,
        guides.guide_status,
        CASE 
            WHEN plant_types.id IS NOT NULL THEN 
                JSON_BUILD_OBJECT(
                    'id', plant_types.id,
                    'plant_name', plant_types.plant_name
                )
            ELSE NULL
        END AS plant_type,
        JSON_BUILD_OBJECT(
                'id', users.uuid,
                'username', users.username,
                'display_name', users.display_name,
                'pfp_url', users.pfp_url
        ) AS author,
        guides.created_at
        FROM guides
        JOIN users ON guides.user_id = users.id
        LEFT JOIN plant_types ON guides.plant_type_id = plant_types.id
        WHERE guides.uuid = %s
        """

        cursor.execute(sql, (guide_uuid,))
        guide = cursor.fetchone()

        cursor.close()

        return guide
    
    @classmethod 
    def get_guide_id(cls, guide_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "SELECT id FROM guides WHERE uuid = %s"
        cursor.execute(sql, (guide_uuid,))
        guide = cursor.fetchone()

        cursor.close()

        return guide