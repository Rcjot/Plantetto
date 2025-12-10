from ..database import get_db
import psycopg2.extras

class Follows:
    def __init__(self, follower_id=None, following_id=None, created_at=None):
        self.follower_id = follower_id
        self.following_id = following_id
        self.created_at = created_at
    
    @classmethod
    def follow(cls, current_user_id, username_to_follow):
        try:
            db = get_db()
            cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            
            sql = "SELECT id FROM users WHERE username = %s"
            cursor.execute(sql, (username_to_follow,))
            user_to_follow = cursor.fetchone()
            
            if not user_to_follow:
                cursor.close()
                return False
            
            following_id = user_to_follow['id']
            
            if int(current_user_id) == following_id:
                cursor.close()
                return False
            
            sql = """
            INSERT INTO follows (follower_id, following_id)
            VALUES (%s, %s)
            ON CONFLICT (follower_id, following_id) DO NOTHING
            """
            cursor.execute(sql, (current_user_id, following_id))
            
            db.commit()
            cursor.close()
            return True
        except Exception as e:
            print(f"Error in follow: {e}")
            return False
    
    @classmethod
    def unfollow(cls, current_user_id, username_to_unfollow):
        try:
            db = get_db()
            cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            
            sql = "SELECT id FROM users WHERE username = %s"
            cursor.execute(sql, (username_to_unfollow,))
            user_to_unfollow = cursor.fetchone()
            
            if not user_to_unfollow:
                cursor.close()
                return False
            
            following_id = user_to_unfollow['id']
            
            sql = """
            DELETE FROM follows 
            WHERE follower_id = %s AND following_id = %s
            """
            cursor.execute(sql, (current_user_id, following_id))
            
            db.commit()
            cursor.close()
            return True
        except Exception as e:
            print(f"Error in unfollow: {e}")
            return False
    
    @classmethod
    def is_following(cls, current_user_id, username):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT EXISTS(
            SELECT 1 FROM follows f
            JOIN users u ON f.following_id = u.id
            WHERE f.follower_id = %s AND u.username = %s
        ) as is_following
        """
        cursor.execute(sql, (current_user_id, username))
        result = cursor.fetchone()
        cursor.close()
        
        return result['is_following'] if result else False
    
    @classmethod
    def get_follow_counts(cls, username):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT 
            (SELECT COUNT(*) FROM follows f 
             JOIN users u ON f.following_id = u.id 
             WHERE u.username = %s) as followers_count,
            (SELECT COUNT(*) FROM follows f 
             JOIN users u ON f.follower_id = u.id 
             WHERE u.username = %s) as following_count
        """
        cursor.execute(sql, (username, username))
        counts = cursor.fetchone()
        cursor.close()
        
        return counts if counts else {"followers_count": 0, "following_count": 0}
    
    @classmethod
    def get_followers(cls, username):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT 
            u.uuid as id,
            u.username,
            u.display_name,
            u.pfp_url
        FROM follows f
        JOIN users u ON f.follower_id = u.id
        JOIN users target ON f.following_id = target.id
        WHERE target.username = %s
        ORDER BY f.created_at DESC
        """
        
        cursor.execute(sql, (username,))
        followers = cursor.fetchall()
        cursor.close()
        
        return followers
    
    @classmethod
    def get_following(cls, username):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT 
            u.uuid as id,
            u.username,
            u.display_name,
            u.pfp_url
        FROM follows f
        JOIN users u ON f.following_id = u.id
        JOIN users target ON f.follower_id = target.id
        WHERE target.username = %s
        ORDER BY f.created_at DESC
        """
        
        cursor.execute(sql, (username,))
        following = cursor.fetchall()
        cursor.close()
        
        return following

    @classmethod 
    def get_notified_posts(cls, username) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT 
            u.uuid as id,
            u.username,
            u.display_name,
            u.pfp_url
        FROM follows f
        JOIN users u ON f.following_id = u.id
        JOIN users target ON f.follower_id = target.id
        WHERE target.username = %s
        AND f.notify_post = TRUE
        ORDER BY f.created_at DESC
        """
        
        cursor.execute(sql, (username,))
        following = cursor.fetchall()
        cursor.close()
        
        return following
    
    @classmethod 
    def get_notified_guides(cls, username) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT 
            u.uuid as id,
            u.username,
            u.display_name,
            u.pfp_url
        FROM follows f
        JOIN users u ON f.following_id = u.id
        JOIN users target ON f.follower_id = target.id
        WHERE target.username = %s
        AND f.notify_guide = TRUE
        ORDER BY f.created_at DESC
        """
        
        cursor.execute(sql, (username,))
        following = cursor.fetchall()
        cursor.close()
        
        return following
    
    @classmethod 
    def get_notification_status(cls, current_user_id, following_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        SELECT 
            notify_post,
            notify_guide
        FROM follows 
        WHERE follower_id = %s AND following_id = %s
        """
        
        cursor.execute(sql, (current_user_id, following_id))
        notif_status = cursor.fetchone()
        cursor.close()
        
        return notif_status

    @classmethod
    def patch_post_notif(cls, current_user_id, username_to_unfollow) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = "SELECT id FROM users WHERE username = %s"
        cursor.execute(sql, (username_to_unfollow,))
        user_to_unfollow = cursor.fetchone()
        
        if not user_to_unfollow:
            cursor.close()
            return False
        
        following_id = user_to_unfollow['id']
        
        sql = """
        UPDATE follows 
        SET notify_post = NOT notify_post
        WHERE follower_id = %s AND following_id = %s
        """
        cursor.execute(sql, (current_user_id, following_id))
        
        db.commit()
        cursor.close()
        return True

    @classmethod
    def patch_guide_notif(cls, current_user_id, username_to_unfollow) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = "SELECT id FROM users WHERE username = %s"
        cursor.execute(sql, (username_to_unfollow,))
        user_to_unfollow = cursor.fetchone()
        
        if not user_to_unfollow:
            cursor.close()
            return False
        
        following_id = user_to_unfollow['id']
        
        sql = """
        UPDATE follows 
        SET notify_guide = NOT notify_guide
        WHERE follower_id = %s AND following_id = %s
        """
        cursor.execute(sql, (current_user_id, following_id))
        
        db.commit()
        cursor.close()
        return True