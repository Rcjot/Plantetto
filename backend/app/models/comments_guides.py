from ..database import get_db
import psycopg2.extras


class CommentsGuides() :
    def __init__(self, id=None, uuid=None, content=None, created_at=None, guide_id=None, user_id=None, parent_id=None):
        self.id=id
        self.uuid=uuid
        self.content=content
        self.created_at=created_at
        self.guide_id=guide_id
        self.user_id=user_id
        self.parent_id=parent_id

    def add(self) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """INSERT INTO comments_guides
        (content, guide_id, user_id, parent_id)
        VALUES (%s, %s, %s, %s)
        RETURNING uuid
        """
        cursor.execute(sql, (self.content, self.guide_id, self.user_id, self.parent_id))
        
        uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()

        return uuid_res
    
    def all(guide_uuid, parent_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """
        SELECT
        current.uuid AS uuid,
        current.content AS content,
        current.created_at AS created_at,
        current.last_edit_date AS last_edit_date,
        JSON_BUILD_OBJECT(
            'id', current_author.uuid,
            'username', current_author.username,
            'display_name', current_author.display_name,
            'pfp_url', current_author.pfp_url
        ) AS author,
        COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'uuid', child.uuid,
                    'content', child.content,
                    'created_at', child.created_at,
                    'last_edit_date', child.last_edit_date,
                    'author', JSON_BUILD_OBJECT(
                        'id', child_author.uuid,
                        'username', child_author.username,
                        'display_name', child_author.display_name,
                        'pfp_url', child_author.pfp_url
                    ),
                    'has_more_replies', (
                        SELECT COUNT(*) > 0
                        FROM comments_guides AS g
                        WHERE g.parent_id = child.id
                    )
                )
            ) FILTER (WHERE child.uuid IS NOT NULL) , '[]'
        ) AS children
        FROM comments_guides AS current
        JOIN users AS current_author 
            ON current.user_id = current_author.id
        LEFT JOIN comments_guides AS child
            ON child.parent_id = current.id
        LEFT JOIN users AS child_author 
            ON child.user_id = child_author.id
        LEFT JOIN comments_guides AS parent
            ON parent.id = current.parent_id 
        JOIN guides AS guide
            ON current.guide_id = guide.id
        WHERE guide.uuid = %s  
        AND parent.uuid IS %s
        GROUP BY current.uuid, current.content, current.created_at, current.last_edit_date,
         current_author.uuid, current_author.username, current_author.display_name, current_author.pfp_url
         ORDER BY current.created_at DESC
        """
        cursor.execute(sql, (guide_uuid, parent_uuid))

        result = cursor.fetchall()
        cursor.close()

        return result

    @classmethod
    def patch_content(cls, comment_uuid, content, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = """UPDATE comments_guides
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

        if result is None :
            return None
        return result  

    @classmethod 
    def delete_comment(cls, comment_uuid, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = """
        DELETE FROM comments_guides AS c 
        USING guides AS p 
        WHERE p.id = c.guide_id
        AND c.uuid = %s 
        AND (c.user_id = %s OR p.user_id = %s)
        RETURNING c.uuid"""
        cursor.execute(sql, (comment_uuid, current_user_id, current_user_id ))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result
    
    @classmethod
    def get_by_uuid(cls, guide_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM comments_guides WHERE uuid = %s"

        cursor.execute(sql, (guide_uuid,))
        result = cursor.fetchone()

        if not result :
            return None

        return cls(
            id=result['id'],
            uuid=result['uuid'],
            guide_id=result['guide_id']
        )
        
    