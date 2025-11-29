from ..database import get_db
import psycopg2.extras
from flask import jsonify

class MarketItems() :
    def __init__(self, id=None, uuid=None, description=None,price=None, status=None, created_at=None,  plant_id=None,user_id=None):
        self.id=id
        self.uuid=uuid
        self.description=description
        self.price = price
        self.status = status
        self.created_at=created_at
        self.plant_id=plant_id
        self.user_id=user_id

    def add(self) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql="""
        INSERT INTO market_items
        (description, price,  plant_id, user_id)
        VALUES (%s, %s, %s, %s)
        RETURNING uuid
        """
        cursor.execute(sql, (self.description,
                             self.price,
                             self.plant_id, 
                             self.user_id))
        uuid_res = cursor.fetchone()

        db.commit()
        cursor.close()

        return uuid_res
       
    @classmethod
    def get_user_listing(cls, username, search, status, sort, plant_type_id, limit, offset) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        listing_query = """
        SELECT 
            mi.uuid,
            description,
            price,
            status,
            JSON_BUILD_OBJECT(
                'plant_uuid', p.uuid,
                'nickname', p.nickname,
                'description', p.plant_description,
                'picture_url', p.picture_url,
                'created_at', p.created_at,
                'plant_type', plant_types.plant_name
            ) as plant
        """
        meta_data_query = """
        SELECT COUNT(*) OVER() AS result_count,
            (SELECT COUNT(*) FROM market_items) AS total_count
        """
        sql = """
        FROM market_items mi
        JOIN users ON mi.user_id = users.id
        JOIN plants p ON mi.plant_id = p.id
        JOIN plant_types ON p.plant_type_id = plant_types.id
        WHERE users.username = %s
        AND p.nickname ILIKE %s
        """
        if status == "active" :
            sql+= "AND mi.status = 'active' "
        elif status == "sold" :
            sql+= "AND mi.status = 'sold' "

        search = "%" + search + "%"
        params = [username, search]
        if (plant_type_id is not None) :
            sql += " AND p.plant_type_id =%s"
            params.extend([plant_type_id])

        sql +="""
        ORDER BY mi.created_at DESC
        """ if sort == "recent" else """
        ORDER BY mi.created_at ASC
        """ 
        # if ever you want to add cheapest/expensive sort, just add conditions here

        sql+= " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

            

        cursor.execute(listing_query + sql, params)
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
    def get_market(cls, search, status, sort, plant_type_id, limit, offset) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        listing_query = """
        SELECT 
            mi.uuid,
            description,
            price,
            status,
            JSON_BUILD_OBJECT(
                'plant_uuid', p.uuid,
                'nickname', p.nickname,
                'description', p.plant_description,
                'picture_url', p.picture_url,
                'created_at', p.created_at,
                'plant_type', plant_types.plant_name
            ) as plant
        """
        meta_data_query = """
        SELECT COUNT(*) OVER() AS result_count,
            (SELECT COUNT(*) FROM market_items) AS total_count
        """
        sql = """
        FROM market_items mi
        JOIN users ON mi.user_id = users.id
        JOIN plants p ON mi.plant_id = p.id
        JOIN plant_types ON p.plant_type_id = plant_types.id
        WHERE p.nickname ILIKE %s
        """
        if status == "active" :
            sql+= "AND mi.status = 'active' "
        elif status == "sold" :
            sql+= "AND mi.status = 'sold' "

        search = "%" + search + "%"
        params = [search]
        if (plant_type_id is not None) :
            sql += " AND p.plant_type_id =%s"
            params.extend([plant_type_id])

        if sort == "cheapest" :
            sql += "ORDER BY mi.price ASC"
        elif sort == "expensive" :
            sql += "ORDER BY mi.price DESC"
        else :
            sql += "ORDER BY mi.created_at DESC"
       
        sql+= " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

            

        cursor.execute(listing_query + sql, params)
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
    def update_item(cls, market_item_uuid, description, price, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql="""
        UPDATE market_items
        SET 
        description = %s,
        price = %s
        WHERE uuid = %s AND user_id = %s 
        RETURNING uuid
        """
        cursor.execute(sql, (description, price, market_item_uuid, current_user_id))

        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result

    @classmethod
    def patch_status(cls, market_item_uuid, status, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        if status == "active" :
            published_date_sql = "sold_at = NULL"
        else :
            published_date_sql = "sold_at = CURRENT_TIMESTAMP"
        
        sql="""
        UPDATE market_items
        SET 
        status = %s,
        """ + published_date_sql + """
        WHERE uuid = %s
        AND user_id = %s 
        RETURNING uuid
        """
        cursor.execute(sql, (status, market_item_uuid, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result    
    
    @classmethod
    def delete_item(cls, market_item_uuid, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "DELETE FROM market_items WHERE uuid = %s AND user_id = %s RETURNING *"
        cursor.execute(sql, (market_item_uuid, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result
    
    @classmethod
    def check_plant_is_item(cls, plant_id, current_user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "SELECT * FROM market_items WHERE plant_id = %s AND user_id = %s "
        cursor.execute(sql, (plant_id, current_user_id))
        result = cursor.fetchone()
        db.commit()
        cursor.close()

        if result is None :
            return None
        return result