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
        content = %s,
        last_edit_date = CURRENT_TIMESTAMP
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
        plant_type_id = %s,
        last_edit_date = CURRENT_TIMESTAMP
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
    def patch_status(cls, guide_uuid, status, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        if status == "draft" :
            published_date_sql = "published_date = NULL"
        else :
            published_date_sql = "published_date = CURRENT_TIMESTAMP"
        
        sql="""
        UPDATE guides
        SET 
        guide_status = %s,
        """ + published_date_sql + """
        WHERE uuid = %s
        AND user_id = %s 
        RETURNING uuid, content, plant_type_id, user_id
        """
        cursor.execute(sql, (status, guide_uuid, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result    

    @classmethod
    def delete_guide(cls, guide_uuid, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "DELETE FROM guides WHERE uuid = %s AND user_id = %s RETURNING *"
        cursor.execute(sql, (guide_uuid, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result
    
    @classmethod 
    def get_user_board(cls, username, search, plant_type_id, limit, offset, sort, status) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        guides_query = """
        WITH thumbnail AS (
            SELECT DISTINCT ON (guide_id)
                guide_id,
                image_url
            FROM guides_images
            WHERE is_used = TRUE
            ORDER BY guide_id ASC
        )
        SELECT 
        guides.uuid, 
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
        guides.created_at,
        guides.published_date,
        guides.last_edit_date,
        thumbnail.image_url AS thumbnail
        """

        meta_data_query = """
        WITH thumbnail AS (
            SELECT DISTINCT ON (guide_id)
                guide_id,
                image_url
            FROM guides_images
            WHERE is_used = TRUE
            ORDER BY guide_id ASC
        )
        SELECT COUNT(*) OVER() AS result_count,
            (SELECT COUNT(*) FROM guides) AS total_count
        """

        sql = """
        FROM guides
        JOIN users ON guides.user_id = users.id
        LEFT JOIN plant_types ON guides.plant_type_id = plant_types.id
        LEFT JOIN thumbnail AS thumbnail ON guides.id = thumbnail.guide_id
        WHERE users.username = %s
        AND guides.title ILIKE %s
        """
        if status == "published" :
            sql+= "AND guides.guide_status = 'published' "
        elif status == "draft" :
            sql+= "AND guides.guide_status = 'draft' "

        search = "%" + search + "%"
        params = [username, search]
        if (plant_type_id is not None) :
            sql += " AND guides.plant_type_id =%s"
            params.extend([plant_type_id])
            
        sql +="""
        ORDER BY guides.last_edit_date DESC
        """ if sort == "recent" else """
        ORDER BY guides.last_edit_date ASC
        """ 
        sql+= " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cursor.execute(guides_query + sql, params)
        guides = cursor.fetchall()
        cursor.execute(meta_data_query + sql, params)
        meta_data = cursor.fetchone()

        cursor.close()

        if (meta_data is None) :
            meta_data = {
                "total_count" : 0,
                "result_count" : 0
            }

        return ({
            "guides" : guides,
            "meta_data" : meta_data
        })

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
        guides.created_at,
        guides.published_date,
        guides.last_edit_date
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
    
    @classmethod
    def get_published_guides(cls, search, plant_type_id, limit, offset, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        guides_query = """
        WITH thumbnail AS (
            SELECT DISTINCT ON (guide_id)
                guide_id,
                image_url
            FROM guides_images
            WHERE is_used = TRUE
            ORDER BY guide_id ASC
        )
        SELECT 
        guides.uuid, 
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
        guides.created_at,
        guides.published_date,
        guides.last_edit_date,
        thumbnail.image_url AS thumbnail,
        (SELECT COUNT(*) FROM comments_guides
        WHERE guide_id = guides.id
        ) AS comment_count,
        (SELECT COUNT(*) FROM likes_guides 
            WHERE guide_id = guides.id
        ) AS like_count,
        EXISTS (
            SELECT l_g.created_at FROM likes_guides l_g
            WHERE l_g.guide_id = guides.id
            AND l_g.user_id  = %s
        )  AS liked
        """

        meta_data_query = """
        WITH thumbnail AS (
            SELECT DISTINCT ON (guide_id)
                guide_id,
                image_url
            FROM guides_images
            WHERE is_used = TRUE
            ORDER BY guide_id ASC
        )
        SELECT COUNT(*) OVER() AS result_count,
            (SELECT COUNT(*) FROM guides) AS total_count
        """

        sql = """
        FROM guides
        JOIN users ON guides.user_id = users.id
        LEFT JOIN plant_types ON guides.plant_type_id = plant_types.id
        LEFT JOIN thumbnail AS thumbnail ON guides.id = thumbnail.guide_id
        WHERE guides.guide_status = 'published'
        AND guides.title ILIKE %s
        """
        search = "%" + search + "%"
        params = [search]
        if (plant_type_id is not None) :
            sql += " AND guides.plant_type_id =%s"
            params.extend([plant_type_id])
        sql+= "ORDER BY guides.published_date DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cursor.execute(guides_query + sql, [current_user_id] + params)
        guides = cursor.fetchall()
        cursor.execute(meta_data_query + sql, params)
        meta_data = cursor.fetchone()

        cursor.close()

        if (meta_data is None) :
            meta_data = {
                "total_count" : 0,
                "result_count" : 0
            }

        return ({
            "guides" : guides,
            "meta_data" : meta_data
        })

    @classmethod
    def get_by_uuid(cls, guide_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM guides WHERE uuid = %s"

        cursor.execute(sql, (guide_uuid,))
        result = cursor.fetchone()

        if not result :
            return None

        return cls(
            id=result['id'],
            uuid=result['uuid'],
        )