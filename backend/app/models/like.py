from ..database import get_db
import psycopg2.extras

class Likes:
    def __init__(self, follower_id=None, following_id=None, created_at=None):
        self.follower_id = follower_id
        self.following_id = following_id
        self.created_at = created_at


    @classmethod
    def toggle_like_post(cls, user_id, post_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        try_delete_sql = """
        DELETE FROM likes_posts
        WHERE user_id = %s
        AND post_id = %s
        RETURNING *
        """

        message = "unlike"
        
        cursor.execute(try_delete_sql, (user_id, post_id))
        result = cursor.fetchone()

        if result is None : 
            message = "like"
            sql = """
            INSERT INTO likes_posts
            (user_id, post_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """
            cursor.execute(sql, (user_id, post_id))
        
        db.commit()
        cursor.close()

        return message


    @classmethod
    def toggle_like_comment_posts(cls, user_id, comment_post_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        try_delete_sql = """
        DELETE FROM likes_comments_posts
        WHERE user_id = %s
        AND comment_post_id = %s
        RETURNING *
        """
        message = "unlike"

        cursor.execute(try_delete_sql, (user_id, comment_post_id))
        result = cursor.fetchone()

        if result is None : 
            message = "like"
            sql = """
            INSERT INTO likes_comments_posts
            (user_id, comment_post_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """
            cursor.execute(sql, (user_id, comment_post_id))
        
        db.commit()
        cursor.close()
        return message

    @classmethod
    def toggle_like_comment_guides(cls, user_id, comment_guide_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        try_delete_sql = """
        DELETE FROM likes_comments_guides
        WHERE user_id = %s
        AND comment_guide_id = %s
        RETURNING *
        """
        message = "unlike"
        
        cursor.execute(try_delete_sql, (user_id, comment_guide_id))
        result = cursor.fetchone()

        if result is None : 
            message = "like"
            sql = """
            INSERT INTO likes_comments_guides
            (user_id, comment_guide_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """
            cursor.execute(sql, (user_id, comment_guide_id))
        
        db.commit()
        cursor.close()
        return message

    @classmethod
    def toggle_like_guide(cls, user_id, guide_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        try_delete_sql = """
        DELETE FROM likes_guides
        WHERE user_id = %s
        AND guide_id = %s
        RETURNING *
        """
        message = "unlike"

        cursor.execute(try_delete_sql, (user_id, guide_id))
        result = cursor.fetchone()

        if result is None : 
            message = "like"
            sql = """
            INSERT INTO likes_guides
            (user_id, guide_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """
            cursor.execute(sql, (user_id, guide_id))
        
        db.commit()
        cursor.close()
        return message




