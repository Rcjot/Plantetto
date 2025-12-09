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
    def get_all_today_of_user(cls, username) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT diaries.uuid, diaries.note, diaries.media_url, diaries.media_type, plants.nickname AS plant
        FROM diaries
        JOIN users ON diaries.user_id = users.id
        JOIN plants ON diaries.plant_id = plants.id
        WHERE users.username = %s
        AND diaries.created_at >= NOW() - INTERVAL '24 hours'
        """

        cursor.execute(sql, (username,))
        diaries = cursor.fetchall()

        cursor.close()

        return diaries

    

    @classmethod 
    def get_all_on_date(cls, on_date) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT 
            JSON_BUILD_OBJECT(
                'media_url', thumb.media_url,
                'media_type', thumb.media_type
            ) AS thumbnail,
            JSON_BUILD_OBJECT(
                'id', users.uuid,
                'username', users.username,
                'display_name', users.display_name,
                'pfp_url', users.pfp_url
            ) AS user,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'uuid', diaries.uuid,
                    'note', diaries.note,
                    'media_url', diaries.media_url,
                    'media_type', diaries.media_type,
                    'plant', plants.nickname,
                    'plant_id', plants.id,
                    'created_at', diaries.created_at
                ) ORDER BY diaries.created_at
            ) AS diaries
        FROM diaries
        JOIN users ON diaries.user_id = users.id
        JOIN plants ON diaries.plant_id = plants.id
        LEFT JOIN LATERAL (
            SELECT media_url, media_type
            FROM diaries
            WHERE user_id = users.id AND media_url IS NOT NULL
            ORDER BY created_at DESC
            LIMIT 1
        ) thumb ON TRUE
        """
        """
        WHERE diaries.created_at >= %s::date 
        AND diaries.created_at < (%s::date + INTERVAL '1 day')
        GROUP BY users.uuid, users.username, users.display_name, users.pfp_url, thumb.media_url, thumb.media_type
        """
        if (on_date == "today") :
            sql +=  """
                    WHERE diaries.created_at >= NOW() - INTERVAL '24 hours'
                    GROUP BY users.uuid, users.username, users.display_name, users.pfp_url, thumb.media_url, thumb.media_type
                    """
            params = []
        else :
            sql +=  """
                    WHERE diaries.created_at >= %s::date 
                    AND diaries.created_at < (%s::date + INTERVAL '1 day')
                    GROUP BY users.uuid, users.username, users.display_name, users.pfp_url, thumb.media_url, thumb.media_type
                    """
            params = [on_date, on_date]

        cursor.execute(sql, params)
        diaries = cursor.fetchall()

        cursor.close()

        return diaries

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

    @classmethod 
    def get_all_on_date_following(cls, on_date, current_user_id):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT 
            JSON_BUILD_OBJECT(
                'media_url', thumb.media_url,
                'media_type', thumb.media_type
            ) AS thumbnail,
            JSON_BUILD_OBJECT(
                'id', users.uuid,
                'username', users.username,
                'display_name', users.display_name,
                'pfp_url', users.pfp_url
            ) AS user,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'uuid', diaries.uuid,
                    'note', diaries.note,
                    'media_url', diaries.media_url,
                    'media_type', diaries.media_type,
                    'plant', plants.nickname,
                    'plant_id', plants.id,
                    'created_at', diaries.created_at
                ) ORDER BY diaries.created_at
            ) AS diaries
        FROM diaries
        JOIN users ON diaries.user_id = users.id
        JOIN plants ON diaries.plant_id = plants.id
        LEFT JOIN LATERAL (
            SELECT media_url, media_type
            FROM diaries
            WHERE user_id = users.id AND media_url IS NOT NULL
            ORDER BY created_at DESC
            LIMIT 1
        ) thumb ON TRUE
        WHERE (
            diaries.user_id IN (
                SELECT following_id 
                FROM follows 
                WHERE follower_id = %s
            )
            OR diaries.user_id = %s
        )
        """
        
        if (on_date == "today") :
            sql +=  """
                    AND DATE(diaries.created_at AT TIME ZONE 'Asia/Manila') >= NOW() - INTERVAL '24 hours'
                    GROUP BY users.uuid, users.username, users.display_name, users.pfp_url, thumb.media_url, thumb.media_type
                    ORDER BY MAX(DATE(diaries.created_at AT TIME ZONE 'Asia/Manila')) DESC
                    """
            params = [current_user_id, current_user_id]
        else :
            sql +=  """
                    AND DATE(diaries.created_at AT TIME ZONE 'Asia/Manila') >= %s::date 
                    AND DATE(diaries.created_at AT TIME ZONE 'Asia/Manila') < (%s::date + INTERVAL '1 day')
                    GROUP BY users.uuid, users.username, users.display_name, users.pfp_url, thumb.media_url, thumb.media_type
                    ORDER BY MAX(DATE(diaries.created_at AT TIME ZONE 'Asia/Manila')) DESC
                    """
            params = [current_user_id, current_user_id, on_date, on_date]

        cursor.execute(sql, params)
        diaries = cursor.fetchall()

        cursor.close()

        return diaries
    
    @classmethod # get diary group of user's plant on specified date
    def get_all_on_date_of_user_of_plant(cls, user_id, plant_id, on_date) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT 
            JSON_BUILD_OBJECT(
                'media_url', thumb.media_url,
                'media_type', thumb.media_type
            ) AS thumbnail,
            JSON_BUILD_OBJECT(
                'id', users.uuid,
                'username', users.username,
                'display_name', users.display_name,
                'pfp_url', users.pfp_url
            ) AS user,
             JSON_BUILD_OBJECT(
                'plant_uuid', plants.uuid,
                'nickname', plants.nickname,
                'description', plants.plant_description,
                'picture_url', plants.picture_url,
                'created_at', plants.created_at,
               'plant_type', plant_types.plant_name,
                'owner', JSON_BUILD_OBJECT(
                    'id', users.uuid,
                    'pfp_url', users.pfp_url,
                    'username', users.username,
                    'display_name', users.display_name
                )
            ) AS plant, 
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'uuid', diaries.uuid,
                    'note', diaries.note,
                    'media_url', diaries.media_url,
                    'media_type', diaries.media_type,
                    'plant', plants.nickname,
                    'plant_id', plants.id,
                    'created_at', diaries.created_at
                ) ORDER BY diaries.created_at
            ) AS diaries
        FROM diaries
        JOIN users ON diaries.user_id = users.id
        JOIN plants ON diaries.plant_id = plants.id
        JOIN plant_types ON plants.plant_type_id = plant_types.id
        LEFT JOIN LATERAL (
            SELECT media_url, media_type
            FROM diaries
            WHERE user_id = users.id AND media_url IS NOT NULL
            ORDER BY created_at DESC
            LIMIT 1
        ) thumb ON TRUE
        WHERE diaries.user_id = %s
        AND diaries.plant_id = %s
        """
        params = [user_id, plant_id]
        if (on_date == "today") :
            sql +=  """
                    AND DATE(diaries.created_at AT TIME ZONE 'Asia/Manila') >= NOW() - INTERVAL '24 hours'
                    GROUP BY users.uuid, users.username, users.display_name, users.pfp_url, thumb.media_url, thumb.media_type,plants.uuid, plants.nickname, plants.plant_description,
                    plants.picture_url, plants.created_at, plant_types.plant_name
                    ORDER BY MAX(DATE(diaries.created_at AT TIME ZONE 'Asia/Manila')) DESC
                    """
        else :
            sql +=  """
                    AND DATE(diaries.created_at AT TIME ZONE 'Asia/Manila') >= %s::date 
                    AND DATE(diaries.created_at AT TIME ZONE 'Asia/Manila') < (%s::date + INTERVAL '1 day')
                    GROUP BY users.uuid, users.username, users.display_name, users.pfp_url, thumb.media_url, thumb.media_type, plants.uuid, plants.nickname, plants.plant_description,
                    plants.picture_url, plants.created_at, plant_types.plant_name
                    ORDER BY MAX(DATE(diaries.created_at AT TIME ZONE 'Asia/Manila')) DESC
                    """
            params += [on_date, on_date]

        cursor.execute(sql, params)
        diaries = cursor.fetchone()

        cursor.close()

        return diaries

    @classmethod 
    def get_all_of_user_plants_with_diary_entry(cls, user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT 
            JSON_BUILD_OBJECT(
                'media_url', thumb.media_url,
                'media_type', thumb.media_type
            ) AS thumbnail,
            JSON_BUILD_OBJECT(
                'plant_uuid', plants.uuid,
                'nickname', plants.nickname,
                'description', plants.plant_description,
                'picture_url', plants.picture_url,
                'created_at', plants.created_at,
               'plant_type', plant_types.plant_name,
                'owner', JSON_BUILD_OBJECT(
                    'id', users.uuid,
                    'pfp_url', users.pfp_url,
                    'username', users.username,
                    'display_name', users.display_name
                )
            ) AS plant, 
            JSON_BUILD_OBJECT(
                'id', users.uuid,
                'username', users.username,
                'display_name', users.display_name,
                'pfp_url', users.pfp_url
            ) AS user,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'uuid', diaries.uuid,
                    'note', diaries.note,
                    'media_url', diaries.media_url,
                    'media_type', diaries.media_type,
                    'plant', plants.nickname,
                    'plant_id', plants.id,
                    'created_at', diaries.created_at
                ) ORDER BY diaries.created_at DESC
            ) AS diaries
        FROM diaries
        JOIN users ON diaries.user_id = users.id
        JOIN plants ON diaries.plant_id = plants.id
        JOIN plant_types ON plants.plant_type_id = plant_types.id
        LEFT JOIN LATERAL (
            SELECT media_url, media_type
            FROM diaries
            WHERE user_id = users.id AND media_url IS NOT NULL
            AND plant_id = plants.id
            ORDER BY created_at DESC
            LIMIT 1
        ) thumb ON TRUE
        WHERE diaries.user_id = %s
        GROUP BY users.uuid, users.username, users.display_name, 
                 users.pfp_url, thumb.media_url, thumb.media_type,
                 plants.uuid, plants.nickname, plants.plant_description,
                 plants.picture_url, plants.created_at, plant_types.plant_name
        """
        params= [user_id]

        cursor.execute(sql, params)
        diaries = cursor.fetchall()

        cursor.close()

        return diaries

    @classmethod
    def get_all_dates_with_entry_of_plant(cls, user_id, plant_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT 
            DISTINCT DATE(diaries.created_at AT TIME ZONE 'Asia/Manila')
        FROM diaries
        JOIN users ON diaries.user_id = users.id
        JOIN plants ON diaries.plant_id = plants.id
        WHERE diaries.user_id = %s
        AND diaries.plant_id = %s

        """
        params= [user_id, plant_id]

        cursor.execute(sql, params)
        dates = cursor.fetchall()

        cursor.close()

        return dates
    
    