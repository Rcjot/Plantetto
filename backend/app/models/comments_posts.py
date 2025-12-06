from ..database import get_db
import psycopg2.extras


class CommentsPosts():
    def __init__(self, id=None, uuid=None, content=None, created_at=None, post_id=None, user_id=None, parent_id=None):
        self.id = id
        self.uuid = uuid
        self.content = content
        self.created_at = created_at
        self.post_id = post_id
        self.user_id = user_id
        self.parent_id = parent_id

    def add(self):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """INSERT INTO comments_posts
        (content, post_id, user_id, parent_id)
        VALUES (%s, %s, %s, %s)
        RETURNING uuid
        """
        cursor.execute(sql, (self.content, self.post_id, self.user_id, self.parent_id))
        
        uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()

        return uuid_res
    
    @classmethod
    def all(cls, post_uuid, parent_uuid=None, current_user_id=None):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT
        c.uuid AS uuid,
        c.content AS content,
        c.created_at AS created_at,
        c.last_edit_date AS last_edit_date,
        JSON_BUILD_OBJECT(
            'id', u.uuid,
            'username', u.username,
            'display_name', u.display_name,
            'pfp_url', u.pfp_url
        ) AS author,
        (SELECT COUNT(*) FROM likes_comments_posts 
        WHERE comment_post_id = c.id
        ) AS like_count,
        EXISTS (
            SELECT l_cp.created_at FROM likes_comments_posts l_cp
            WHERE l_cp.comment_post_id = c.id
            AND l_cp.user_id  = %s
        )  AS liked
        FROM comments_posts AS c
        JOIN users AS u ON c.user_id = u.id
        JOIN posts AS p ON c.post_id = p.id
        WHERE p.uuid = %s  
        AND c.parent_id IS NULL  -- Only get top-level comments
        ORDER BY c.created_at DESC
        """
        cursor.execute(sql, (current_user_id, post_uuid,))

        result = cursor.fetchall()
        cursor.close()

        return result

    @classmethod
    def patch_content(cls, comment_uuid, content, current_user_id):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """UPDATE comments_posts
        SET content = %s,
        last_edit_date = NOW()
        WHERE uuid = %s
        AND user_id = %s
        RETURNING uuid
        """
        cursor.execute(sql, (content, comment_uuid, current_user_id))
        
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None:
            return None
        return result  

    @classmethod 
    def delete_comment(cls, comment_uuid, current_user_id):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        DELETE FROM comments_posts AS c 
        USING posts AS p 
        WHERE p.id = c.post_id
        AND c.uuid = %s 
        AND (c.user_id = %s OR p.user_id = %s)
        RETURNING c.uuid"""
        cursor.execute(sql, (comment_uuid, current_user_id, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None:
            return None
        return result
    
    @classmethod
    def get_by_uuid(cls, comment_uuid):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM comments_posts WHERE uuid = %s"

        cursor.execute(sql, (comment_uuid,))
        result = cursor.fetchone()

        if not result:
            return None

        return cls(
            id=result['id'],
            uuid=result['uuid'],
            post_id=result['post_id']
        )