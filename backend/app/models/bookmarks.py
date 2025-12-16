from ..database import get_db
import psycopg2.extras

class Bookmarks:
    def __init__(self, follower_id=None, following_id=None, created_at=None):
        self.follower_id = follower_id
        self.following_id = following_id
        self.created_at = created_at


    @classmethod
    def toggle_bookmark_post(cls, user_id, post_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        try_delete_sql = """
        DELETE FROM bookmarks_posts
        WHERE user_id = %s
        AND post_id = %s
        RETURNING *
        """

        message = "unbookmark"
        
        cursor.execute(try_delete_sql, (user_id, post_id))
        result = cursor.fetchone()

        if result is None : 
            message = "bookmark"
            sql = """
            INSERT INTO bookmarks_posts
            (user_id, post_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """
            cursor.execute(sql, (user_id, post_id))
        
        db.commit()
        cursor.close()

        return message


    @classmethod
    def toggle_bookmark_guide(cls, user_id, guide_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        try_delete_sql = """
        DELETE FROM bookmarks_guides
        WHERE user_id = %s
        AND guide_id = %s
        RETURNING *
        """
        message = "unbookmark"

        cursor.execute(try_delete_sql, (user_id, guide_id))
        result = cursor.fetchone()

        if result is None : 
            message = "bookmark"
            sql = """
            INSERT INTO bookmarks_guides
            (user_id, guide_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """
            cursor.execute(sql, (user_id, guide_id))
        
        db.commit()
        cursor.close()
        return message
    
    @classmethod
    def toggle_bookmark_market_item(cls, user_id, market_item_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        try_delete_sql = """
        DELETE FROM bookmarks_market
        WHERE user_id = %s
        AND market_item_id = %s
        RETURNING *
        """
        message = "unbookmark"

        cursor.execute(try_delete_sql, (user_id, market_item_id))
        result = cursor.fetchone()

        if result is None : 
            message = "bookmark"
            sql = """
            INSERT INTO bookmarks_market
            (user_id, market_item_id)
            VALUES (%s, %s)
            ON CONFLICT DO NOTHING
            """
            cursor.execute(sql, (user_id, market_item_id))
        
        db.commit()
        cursor.close()
        return message