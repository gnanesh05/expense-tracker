from flask import Blueprint,  request,jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from pymongo import ReturnDocument
from datetime import datetime, timezone
from app.models.ExpenseModel import Expense
from app.helper import mongo

expense_bp = Blueprint('expense',__name__)

#fetch expenses
@expense_bp.route("/",methods=['GET'])
@jwt_required()
def get_expenses():
    user_id =  get_jwt_identity() 
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    documents = mongo.db.expenses.find({'user_id':str(user_id)})
    expenses = []
    for doc in documents:
        obj = {}
        obj['id'] = str(doc['_id'])
        obj['user_id'] = str(doc['user_id'])
        obj['category'] = doc['category']
        obj['description'] = doc['description']
        obj['amount'] = doc['amount']
        obj['timestamp'] = doc['timestamp'].isoformat()

        expenses.append(obj)
    return jsonify({"expenses":expenses}),200


#add expense
@expense_bp.route('/',methods=['POST'])
@jwt_required()
def insert_expense():
    user_id =  get_jwt_identity() 
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    data = request.get_json()
    category = data.get('category')
    description = data.get('description')
    amount =  data.get('amount')

    if not category or not description or not amount:
        return jsonify({"error":"category, description and amount are required"}), 400
    
    current_timestamp = datetime.now(timezone.utc)
    expense = Expense(user_id=user_id, category=category,description=description, amount=amount, timestamp=current_timestamp)
    result = mongo.db.expenses.insert_one(expense.to_dict())
    expense_data = expense.to_dict()
    expense_data["id"] = str(result.inserted_id)
    expense_data['timestamp'] = expense_data['timestamp'].isoformat()

    return jsonify({"message":"expense successfully added", "expense":expense_data})


#edit expense
@expense_bp.route('/', methods=['PUT'])
@jwt_required()
def update_expense():
    user_id =  get_jwt_identity() 
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    data = request.get_json()
    id = request.args.get('id')
    category = data.get('category')
    description = data.get('description')
    amount =  data.get('amount')
    print(id)
    if not id or not category or not description or not amount:
        return jsonify({"error":"id, category, description and amount are required"}), 400
    
    
    current_timestamp = datetime.now(timezone.utc)
    update_fields = {}
    update_fields['category'] = category
    update_fields['description'] =  description
    update_fields['amount'] = amount
    update_fields['timestamp'] = current_timestamp
    print(update_fields, user_id)
    result = mongo.db.expenses.find_one_and_update({'_id':ObjectId(id),'user_id':user_id},{'$set':update_fields},
                                                    return_document=ReturnDocument.AFTER,)
    
    if not result:
        return jsonify({"error":"Expense does not exist"}), 404
    expense_data = {"id":str(result.get('_id')),"category":result.get('category'),'description':result.get('description'),'amount':result.get('amount'),'timestamp':result.get('timestamp').isoformat()}
    return jsonify({"message":"expense updated", "expense":expense_data}), 200


#delete expense
@expense_bp.route('/', methods=['DELETE'])
@jwt_required()
def delete_expense():
    user_id =  get_jwt_identity() 
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    expense_id = request.args.get('id')
    result = mongo.db.expenses.delete_one({"_id":ObjectId(expense_id),"user_id":user_id})

    if result.deleted_count == 0:
        return jsonify({"error":"Expense does not exist"}), 404
    return jsonify({"message":"expense deleted"}), 200

