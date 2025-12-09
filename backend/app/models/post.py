from ..database import get_db
import psycopg2.extras

class Posts() :
    def __init__(self, id=None, uuid=None, caption=None, created_at=None, user_id=None) :
        self.id = id
        self.uuid = uuid
        self.caption = caption
        self.created_at = created_at
        self.user_id = user_id
    
    def add(self) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = "INSERT INTO posts(caption, user_id) VALUES(%s, %s) RETURNING id, uuid"
        cursor.execute(sql, (self.caption, self.user_id))

        id_uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()
    

        return id_uuid_res

    @classmethod
    def all(cls, limit, cursor_id, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql =   """
                WITH max_ratio_media AS (
                    SELECT DISTINCT ON (post_id)
                        post_id,
                        width,
                        height
                    FROM media
                    ORDER BY post_id, (height::float / width::float) DESC
                )
                SELECT 
                    posts.id AS cursor_id,
                    posts.uuid AS post_uuid,
                    posts.caption,
                    posts.created_at,
                    JSON_BUILD_OBJECT(
                        'id', users.uuid,
                        'pfp_url', users.pfp_url,
                        'username', users.username,
                        'display_name', users.display_name
                    ) AS author,
                    COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'url', media.media_url,
                                'order', media.media_order,
                                'type', media.media_type
                            ) ORDER BY media.media_order
                        ) FILTER (WHERE media.id IS NOT NULL), '[]'
                    ) AS media,
                    max_ratio.width AS highlight_width,
                    max_ratio.height AS highlight_height,
                    (SELECT COUNT(*) FROM comments_posts 
                    WHERE post_id = posts.id
                    ) AS comment_count,
                    (SELECT COUNT(*) FROM likes_posts 
                        WHERE post_id = posts.id
                    ) AS like_count,
                    EXISTS (
                        SELECT l_p.created_at FROM likes_posts l_p
                        WHERE l_p.post_id = posts.id
                        AND l_p.user_id  = %s
                    )  AS liked
                FROM posts
                JOIN users ON posts.user_id = users.id
                LEFT JOIN media ON media.post_id = posts.id
                LEFT JOIN max_ratio_media AS max_ratio ON max_ratio.post_id = posts.id
                """
        params = [current_user_id]
        if cursor_id :
            sql +=  """
                    WHERE posts.id < %s
                    GROUP BY posts.id, users.uuid, users.pfp_url, users.username, users.display_name, max_ratio.width, max_ratio.height
                    ORDER BY posts.created_at DESC
                    LIMIT %s
                    """
            params += [cursor_id, limit + 1]
        else : 
            sql +=  """
                    GROUP BY posts.id, users.uuid, users.pfp_url, users.username, users.display_name, max_ratio.width, max_ratio.height
                    ORDER BY posts.created_at DESC
                    LIMIT %s
                    """
            params += [limit + 1]
        
        cursor.execute(sql, params)
        posts = cursor.fetchall()
        cursor.close()

        return posts

    @classmethod
    def get_post(cls, post_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = """
                WITH max_ratio_media AS (
                    SELECT DISTINCT ON (post_id)
                        post_id,
                        width,
                        height
                    FROM media
                    ORDER BY post_id, (height::float / width::float) DESC
                )
                SELECT 
                    posts.uuid AS post_uuid,
                    posts.caption,
                    posts.created_at,
                    JSON_BUILD_OBJECT(
                        'id', users.uuid,
                        'pfp_url', users.pfp_url,
                        'username', users.username,
                        'display_name', users.display_name
                    ) AS author,
                    COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'url', media.media_url,
                                'order', media.media_order,
                                'type', media.media_type
                            ) ORDER BY media.media_order
                        ) FILTER (WHERE media.id IS NOT NULL), '[]'
                    ) AS media,
                    max_ratio.width AS highlight_width,
                    max_ratio.height AS highlight_height
                FROM posts
                JOIN users ON posts.user_id = users.id
                LEFT JOIN media ON media.post_id = posts.id
                LEFT JOIN max_ratio_media AS max_ratio ON max_ratio.post_id = posts.id
                WHERE posts.uuid = %s
                GROUP BY posts.id, users.uuid, users.pfp_url, users.username, users.display_name, max_ratio.width, max_ratio.height
                """
        cursor.execute(sql, (post_uuid,))
        result = cursor.fetchone()
        cursor.close()

        return result
    
    @classmethod
    def delete(cls, post_uuid, current_user_id) :
        db = get_db()
        cursor = db.cursor()
        sql = "DELETE FROM posts WHERE uuid = %s AND user_id = %s RETURNING *"
        cursor.execute(sql, (post_uuid, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None:
            return None
        return result

    
    @classmethod
    def update(cls, post_uuid, caption, current_user_id) :
        db = get_db()
        cursor = db.cursor()
        sql = "UPDATE posts SET caption = %s WHERE uuid = %s AND user_id =%s RETURNING *"
        cursor.execute(sql, (caption, post_uuid, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None:
            return None
        return result
    
    @classmethod
    def get_by_uuid(cls, post_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM posts WHERE uuid = %s"

        cursor.execute(sql, (post_uuid,))
        result = cursor.fetchone()

        if not result :
            return None

        return cls(
            id=result['id'],
            uuid=result['uuid'],
        )
    
    @classmethod
    def get_bookmarked_post(cls, current_user_id, limit, offset):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
                WITH max_ratio_media AS (
                    SELECT DISTINCT ON (post_id)
                        post_id,
                        width,
                        height
                    FROM media
                    ORDER BY post_id, (height::float / width::float) DESC
                )
                SELECT 
                    posts.uuid AS post_uuid,
                    posts.caption,
                    posts.created_at,
                    JSON_BUILD_OBJECT(
                        'id', users.uuid,
                        'pfp_url', users.pfp_url,
                        'username', users.username,
                        'display_name', users.display_name
                    ) AS author,
                    COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'url', media.media_url,
                                'order', media.media_order,
                                'type', media.media_type
                            ) ORDER BY media.media_order
                        ) FILTER (WHERE media.id IS NOT NULL), '[]'
                    ) AS media,
                    max_ratio.width AS highlight_width,
                    max_ratio.height AS highlight_height,
                    (SELECT COUNT(*) FROM comments_posts 
                        WHERE post_id = posts.id
                    ) AS comment_count,
                    (SELECT COUNT(*) FROM likes_posts 
                        WHERE post_id = posts.id
                    ) AS like_count,
                    EXISTS (
                        SELECT l_p.created_at FROM likes_posts l_p
                        WHERE l_p.post_id = posts.id
                        AND l_p.user_id = %s
                    ) AS liked,
                    TRUE as bookmarked
                FROM posts
                JOIN bookmarks_posts ON posts.id = bookmarks_posts.post_id
                JOIN users ON posts.user_id = users.id
                LEFT JOIN media ON media.post_id = posts.id
                LEFT JOIN max_ratio_media AS max_ratio ON max_ratio.post_id = posts.id
                WHERE bookmarks_posts.user_id = %s
                GROUP BY posts.id, users.uuid, users.pfp_url, users.username, users.display_name, max_ratio.width, max_ratio.height, bookmarks_posts.created_at
                ORDER BY bookmarks_posts.created_at DESC
                LIMIT %s OFFSET %s
                """
        
        cursor.execute(sql, (current_user_id, current_user_id, limit, offset))
        posts = cursor.fetchall()
        cursor.close()

        return posts