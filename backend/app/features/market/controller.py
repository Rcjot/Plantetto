from . import market_bp
from flask_login import login_required, current_user
from flask import request, jsonify
from .forms import MarketItemForm, UpdateMarketItemForm
from ...models.market import MarketItems
from ...models.user import Users
import math

@market_bp.route("/")
def get_market() :
    status = request.args.get("status", default="all", type=str)
    sort = request.args.get("sort", default="", type=str)
    search = request.args.get("search", default="", type=str)
    plant_type_id = request.args.get("plant_type_id", default=None, type=int)
    page = request.args.get("page", default=1, type=int)
    limit = request.args.get("limit", default = 12, type=int)

    offset = (page - 1) * limit
    current_user_id = current_user.get_id()

    result = MarketItems.get_market(search, status, sort, plant_type_id, limit, offset, current_user_id)
    market = result["guides"]
    total_count = result["meta_data"]["total_count"]
    result_count = result["meta_data"]["result_count"]
    max_page = math.ceil(result_count / limit)
    meta_data = {
        "page" : page,
        "total_count" : total_count,
        "limit" : limit,
        "max_page" : max_page,
        "has_next" : page < max_page,
        "has_prev" : page > 1,
    }

    return jsonify(
        market=market,
        meta_data=meta_data
    )

@market_bp.route("/", methods=["POST"])
@login_required
def add_market_item() :
    current_user_json = current_user.get_json()
    if (not current_user_json['seller_verified']) :
        return jsonify(message="unauthorized"), 403

    form = MarketItemForm()
    current_user_id = current_user.get_id()
    form.current_user_id = current_user_id
    validated = form.validate()
    error = {
        "description" : form.description.errors,
        "price" : form.price.errors,
        "plant_id": form.plant_id.errors

    }
    if validated :
        new_market_item = MarketItems(description=form.description.data,
                                      price=form.price.data,
                                      plant_id=form.plant_id.data,
                                      user_id=current_user_id)
        uuid_res = new_market_item.add()
        
        return jsonify(success=True, market_item_uuid= uuid_res["uuid"])
    return jsonify(success=False,
                message="form fields might be invalid",
                error=error), 400

@market_bp.route("/<uuid:market_item_uuid>", methods=["PUT"])
@login_required
def update_market_item(market_item_uuid) :
    market_item_uuid = str(market_item_uuid)
    form = UpdateMarketItemForm()
    current_user_id = current_user.get_id()
    validated = form.validate()
    error = {
        "description" : form.description.errors,
        "price" : form.price.errors,
    }
    if validated :

        to_update_market_item = MarketItems.update_item(market_item_uuid=market_item_uuid,
                                                        description=form.description.data,
                                                        price=form.price.data,
                                                        current_user_id=current_user_id)
        if (to_update_market_item) :
            return jsonify(success=True, market_item_uuid=market_item_uuid)
        return jsonify(success=False, message="update item failed"), 404
            
    return jsonify(success=False,
                message="form fields might be invalid",
                error=error), 400

@market_bp.route("/<uuid:market_item_uuid>/status", methods=["PATCH"])
@login_required
def patch_status(market_item_uuid) :
    market_item_uuid = str(market_item_uuid)
    data = request.get_json()
    status = data["status"]
    
    current_user_id = current_user.get_id()
    to_update_guide = MarketItems.patch_status(market_item_uuid=market_item_uuid, status=status, current_user_id=current_user_id )

    if (to_update_guide) :
        return jsonify(success=True, market_item_uuid=market_item_uuid)
    return jsonify(success=False, message="update item failed"), 404

@market_bp.route("/<uuid:market_item_uuid>", methods=["DELETE"])
def delete_market_item(market_item_uuid) :
    market_item_uuid = str(market_item_uuid)
    to_delete_guide = MarketItems.delete_item(market_item_uuid, current_user.get_id())
    if (to_delete_guide):
        return jsonify(success=True, message="delete guide successful")
    else :
        return jsonify(success=False, message="delete guide failed"), 404
    
@market_bp.route("/<uuid:market_item_uuid>")
def get_market_item(market_item_uuid):
    market_item_uuid = str(market_item_uuid)
    
    try:
        current_user_id = current_user.get_id()
        result = MarketItems.get_market_item(market_item_uuid, current_user_id)
        
        if result is None:
            return jsonify(success=False, message="market item dont exist"), 404
        
        return jsonify(success=True, market_item=result)
    except Exception as e:
        print(e)
        return jsonify(success=False, message="server error"), 500
    
@market_bp.route("/<uuid:market_item_uuid>/related")
def get_related_items(market_item_uuid):
    market_item_uuid = str(market_item_uuid)
    limit = 5
    
    try:
        current_user_id = current_user.get_id()
        current_item = MarketItems.get_market_item(market_item_uuid, current_user_id)
        
        if not current_item:
            return jsonify(success=False, message="Item not found"), 404
        
        plant_type_name = current_item.get('plant', {}).get('plant_type')
        
        if not plant_type_name:
            related = MarketItems.get_related_items(
                market_item_uuid=market_item_uuid,
                plant_type_name=None,
                limit=limit
            )
            return jsonify(success=True, items=related)
        
        related = MarketItems.get_related_items(
            market_item_uuid=market_item_uuid,
            plant_type_name=plant_type_name,
            limit=limit
        )
        
        return jsonify(success=True, items=related)
        
    except Exception as e:
        print(f"Error in get_related_items: {e}")
        return jsonify(success=False, message="Server error"), 500
    

@market_bp.route("/available-plants")
@login_required
def get_available_plants():
    current_user_id = current_user.get_id()
    user = Users.get_by_id(current_user_id)
    
    plants = MarketItems.get_available_plants_for_listing(user.username)
    
    return jsonify(
        success=True,
        plants=plants
    )
