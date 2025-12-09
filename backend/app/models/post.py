from ..database import get_db
import psycopg2.extras

class Posts():
    def __init__(self, id=None, uuid=None, caption=None, visibility=None, created_at=None, user_id=None):
        self.id = id
        self.uuid = uuid
        self.caption = caption
        self.visibility = visibility
        self.created_at = created_at
        self.user_id = user_id
    
    def add(self):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor) 

        sql = "INSERT INTO posts(caption, visibility, user_id) VALUES(%s, %s, %s) RETURNING id, uuid"
        cursor.execute(sql, (self.caption, self.visibility, self.user_id))

        id_uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()
    
        return id_uuid_res

    @classmethod
    def get_by_uuid(cls, post_uuid):
        """Get post by UUID (for form validation)."""
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM posts WHERE uuid = %s"

        cursor.execute(sql, (post_uuid,))
        result = cursor.fetchone()

        if not result:
            return None

        return cls(
            id=result['id'],
            uuid=result['uuid'],
            caption=result['caption'],
            visibility=result['visibility'],
            created_at=result['created_at'],
            user_id=result['user_id']
        )

    @classmethod
    def all(cls, limit, cursor_score, cursor_timestamp, current_user_id, user_id=None):
        """
        Fetch posts with priority buckets and visibility rules:
        - Priority 3: Recent posts from YOU and people you follow (last 24 hours)
        - Priority 2: Recent posts from everyone else (last 24 hours)
        - Priority 1: Older posts (everything 24+ hours old)
        
        This ensures fresh content always surfaces first, with your own posts
        and followed users getting preference within the recent timeframe.
        
        Visibility rules:
        - 'everyone': visible to all
        - 'private': visible to author and followers
        - 'for_me': visible only to author
        """
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        sql = """
        WITH cutoff_time AS (
            SELECT NOW() - INTERVAL '24 hours' AS recent_cutoff
        ),
        scored_posts AS (
            SELECT 
                p.id,
                p.uuid AS post_uuid,
                p.caption,
                p.visibility,
                p.created_at,
                p.user_id,
                CASE
                    -- Recent posts from YOU or followed users get highest priority
                    WHEN (p.user_id = %s OR f.following_id IS NOT NULL)
                        AND p.created_at >= (SELECT recent_cutoff FROM cutoff_time)
                    THEN 3
                    -- Recent posts from non-followed users
                    WHEN p.created_at >= (SELECT recent_cutoff FROM cutoff_time)
                    THEN 2
                    -- All older posts (lowest priority)
                    ELSE 1
                END AS priority_score
            FROM posts p
            LEFT JOIN follows f 
                ON f.following_id = p.user_id AND f.follower_id = %s
            WHERE 
                -- Visibility filtering
                (
                    p.visibility = 'everyone'
                    OR (p.visibility = 'private' AND (
                        p.user_id = %s 
                        OR f.following_id IS NOT NULL
                    ))
                    OR (p.visibility = 'for_me' AND p.user_id = %s)
                )
        ),
        max_ratio_media AS (
            SELECT DISTINCT ON (post_id)
                post_id,
                width,
                height
            FROM media
            ORDER BY post_id, (height::float / width::float) DESC
        )
        SELECT 
            sp.id AS cursor_id,
            sp.post_uuid,
            sp.caption,
            sp.visibility,
            sp.created_at,
            sp.priority_score,
            JSON_BUILD_OBJECT(
                'id', u.uuid,
                'pfp_url', u.pfp_url,
                'username', u.username,
                'display_name', u.display_name
            ) AS author,
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'url', m.media_url,
                        'order', m.media_order,
                        'type', m.media_type
                    ) ORDER BY m.media_order
                ) FILTER (WHERE m.id IS NOT NULL), '[]'
            ) AS media,
            COALESCE(
                (SELECT
                    COALESCE (
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', p.id,
                                'uuid', p.uuid,
                                'nickname', p.nickname
                            ) 
                        ) FILTER (WHERE pt.id IS NOT NULL), '[]'
                    ) AS planttags
                FROM plant_tags pt
                LEFT JOIN plants p ON p.id = pt.plant_id
                JOIN posts psb ON pt.post_id = psb.id
                WHERE psb.id = sp.id
                GROUP BY pt.post_id), '[]'
            ) AS planttags,
            mr.width AS highlight_width,
            mr.height AS highlight_height,
            -- ADDED FROM OTHER REPO: comment_count
            (SELECT COUNT(*) FROM comments_posts WHERE post_id = sp.id) AS comment_count,
            -- ADDED FROM OTHER REPO: like_count
            (SELECT COUNT(*) FROM likes_posts WHERE post_id = sp.id) AS like_count,
            -- ADDED FROM OTHER REPO: liked (whether current user liked the post)
            EXISTS (
                SELECT l_p.created_at FROM likes_posts l_p
                WHERE l_p.post_id = sp.id
                AND l_p.user_id = %s
            ) AS liked
        FROM scored_posts sp
        JOIN users u ON sp.user_id = u.id
        LEFT JOIN media m ON m.post_id = sp.id
        LEFT JOIN max_ratio_media mr ON mr.post_id = sp.id
        WHERE 1=1
        """
        
        params = [current_user_id, current_user_id, current_user_id, current_user_id, current_user_id]
        
        # add cursor filtering
        if cursor_score is not None and cursor_timestamp is not None:
            sql += """
            AND (sp.priority_score, sp.created_at) < (%s, %s)
            """
            params.extend([cursor_score, cursor_timestamp])

        if user_id :
            sql += " AND sp.user_id = %s "
            params.extend([user_id])
        
        sql += """
        GROUP BY sp.id, sp.post_uuid, sp.caption, sp.visibility, sp.created_at, 
                 sp.priority_score, u.uuid, u.pfp_url, u.username, u.display_name,
                 mr.width, mr.height
        ORDER BY sp.priority_score DESC, sp.created_at DESC
        LIMIT %s
        """
        
        params.append(limit + 1)
        
        cursor.execute(sql, params)
        posts = cursor.fetchall()
        cursor.close()

        return posts

    @classmethod
    def get_post(cls, post_uuid, current_user_id=None):
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
            posts.visibility,
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
            COALESCE (
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', p.id,
                        'uuid', p.uuid,
                        'nickname', p.nickname
                    ) 
                ) FILTER (WHERE pt.id IS NOT NULL), '[]'
            ) AS planttags,
            max_ratio.width AS highlight_width,
            max_ratio.height AS highlight_height,
            -- ADDED FROM OTHER REPO: comment_count
            (SELECT COUNT(*) FROM comments_posts WHERE post_id = posts.id) AS comment_count,
            -- ADDED FROM OTHER REPO: like_count
            (SELECT COUNT(*) FROM likes_posts WHERE post_id = posts.id) AS like_count
        """
        
        # Conditionally add liked field if current_user_id is provided
        if current_user_id is not None:
            sql += """,
                -- ADDED FROM OTHER REPO: liked (whether current user liked the post)
                EXISTS (
                    SELECT l_p.created_at FROM likes_posts l_p
                    WHERE l_p.post_id = posts.id
                    AND l_p.user_id = %s
                ) AS liked
            """
        
        sql += """
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN media ON media.post_id = posts.id
        LEFT JOIN max_ratio_media AS max_ratio ON max_ratio.post_id = posts.id
        LEFT JOIN plant_tags pt ON posts.id = pt.post_id
        LEFT JOIN plants p ON p.id = pt.plant_id
        WHERE posts.uuid = %s
        GROUP BY posts.id, users.uuid, users.pfp_url, users.username, 
                 users.display_name, max_ratio.width, max_ratio.height
        """
        
        if current_user_id is not None:
            cursor.execute(sql, (current_user_id, post_uuid))
        else:
            cursor.execute(sql, (post_uuid,))
            
        result = cursor.fetchone()
        cursor.close()

        return result

    @classmethod
    def explore(cls, limit, search, cursor_timestamp, plant_type, current_user_id=None):
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
                    COALESCE (
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', p.id,
                                'uuid', p.uuid,
                                'nickname', p.nickname
                            ) 
                        ) FILTER (WHERE pt.id IS NOT NULL), '[]'
                    ) AS planttags,
                    max_ratio.width AS highlight_width,
                    max_ratio.height AS highlight_height,
                    -- ADDED FROM OTHER REPO: comment_count
                    (SELECT COUNT(*) FROM comments_posts WHERE post_id = posts.id) AS comment_count,
                    -- ADDED FROM OTHER REPO: like_count
                    (SELECT COUNT(*) FROM likes_posts WHERE post_id = posts.id) AS like_count
                """
        
        # Conditionally add liked field if current_user_id is provided
        if current_user_id is not None:
            sql += """,
                    -- ADDED FROM OTHER REPO: liked (whether current user liked the post)
                    EXISTS (
                        SELECT l_p.created_at FROM likes_posts l_p
                        WHERE l_p.post_id = posts.id
                        AND l_p.user_id = %s
                    ) AS liked
            """
        
        sql += """
                FROM posts
                JOIN users ON posts.user_id = users.id
                LEFT JOIN media ON media.post_id = posts.id
                LEFT JOIN max_ratio_media AS max_ratio ON max_ratio.post_id = posts.id
                LEFT JOIN plant_tags pt ON posts.id = pt.post_id
                LEFT JOIN plants p ON p.id = pt.plant_id
                LEFT JOIN plant_types pty ON p.plant_type_id = pty.id
                """
        
        search_like = "%" + search + "%"
        condition = """(posts.caption ILIKE %s OR pty.plant_name ILIKE %s 
                    OR users.username ILIKE %s OR users.display_name ILIKE %s) """
        condition_params = [search_like] * 4

        if plant_type:
            condition += "AND pty.plant_name = %s "
            condition_params.append(plant_type)

        # Only include posts with visibility = 'everyone'   
        condition += "AND posts.visibility = 'everyone' "

        params = []
        if current_user_id is not None:
            params.append(current_user_id)
        
        if cursor_timestamp:
            sql += f"""
                    WHERE posts.created_at < %s
                    AND {condition}
                    GROUP BY posts.id, users.uuid, users.pfp_url, users.username, users.display_name, max_ratio.width, max_ratio.height
                    ORDER BY posts.created_at DESC
                    LIMIT %s
                    """
            params = params + [cursor_timestamp] + condition_params + [limit + 1]
        else: 
            sql += f"""
                    WHERE {condition}
                    GROUP BY posts.id, users.uuid, users.pfp_url, users.username, users.display_name, max_ratio.width, max_ratio.height
                    ORDER BY posts.created_at DESC
                    LIMIT %s
                    """
            params = params + condition_params + [limit + 1]

        cursor.execute(sql, params)
        posts = cursor.fetchall()
        cursor.close()

        return posts
    
    @classmethod
    def explorePostsOfPlant(cls, limit, search, cursor_timestamp, plant_type, current_user_id):
        """
        Explore posts for a specific plant type, using current_user_id to exclude their own posts.
        """
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
                posts.id AS cursor_id,
                posts.uuid AS post_uuid,
                posts.caption,
                posts.created_at,
                JSON_BUILD_OBJECT(
                    'id', users.id,
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
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', p.id,
                            'uuid', p.uuid,
                            'nickname', p.nickname
                        )
                    ) FILTER (WHERE pt.id IS NOT NULL), '[]'
                ) AS planttags,
                max_ratio.width AS highlight_width,
                max_ratio.height AS highlight_height,
                -- ADDED FROM OTHER REPO: comment_count
                (SELECT COUNT(*) FROM comments_posts WHERE post_id = posts.id) AS comment_count,
                -- ADDED FROM OTHER REPO: like_count
                (SELECT COUNT(*) FROM likes_posts WHERE post_id = posts.id) AS like_count,
                -- ADDED FROM OTHER REPO: liked (whether current user liked the post)
                EXISTS (
                    SELECT l_p.created_at FROM likes_posts l_p
                    WHERE l_p.post_id = posts.id
                    AND l_p.user_id = %s
                ) AS liked
            FROM posts
            JOIN users ON posts.user_id = users.id
            LEFT JOIN media ON media.post_id = posts.id
            LEFT JOIN max_ratio_media AS max_ratio ON max_ratio.post_id = posts.id
            LEFT JOIN plant_tags pt ON posts.id = pt.post_id
            LEFT JOIN plants p ON p.id = pt.plant_id
            LEFT JOIN plant_types pty ON p.plant_type_id = pty.id
            WHERE posts.user_id != %s
        """

        params = [current_user_id, current_user_id]

        if search:
            search_like = f"%{search}%"
            sql += """
                AND (posts.caption ILIKE %s OR pty.plant_name ILIKE %s
                    OR users.username ILIKE %s OR users.display_name ILIKE %s)
            """
            params.extend([search_like] * 4)

        if plant_type:
            sql += " AND pty.plant_name = %s"
            params.append(plant_type)
        sql += " AND posts.visibility = 'everyone'"

        if cursor_timestamp:
            sql += " AND posts.created_at < %s"
            params.append(cursor_timestamp)

        sql += """
            GROUP BY posts.id, users.id, users.pfp_url, users.username, users.display_name, max_ratio.width, max_ratio.height
            ORDER BY posts.created_at DESC
            LIMIT %s
        """
        params.append(limit + 1)

        cursor.execute(sql, params)
        posts = cursor.fetchall()
        cursor.close()

        return posts

    @classmethod
    def delete(cls, post_uuid, current_user_id):
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
    def update(cls, post_uuid, caption, visibility, current_user_id):
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
            UPDATE posts
            SET 
                caption = %s,
                visibility = %s
            WHERE uuid = %s 
            AND user_id = %s
            RETURNING id, uuid, caption, visibility, created_at, user_id
        """

        cursor.execute(sql, (caption, visibility, post_uuid, current_user_id))
        result = cursor.fetchone()

        db.commit()
        cursor.close()

        if result is None:
            return None

        return result