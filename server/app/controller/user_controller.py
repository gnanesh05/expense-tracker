from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token,jwt_required, get_jwt_identity
from bson import ObjectId
from app.models.UserModel import User
from app.helper import mongo

user_bp = Blueprint('user',__name__)


#register user
@user_bp.route("/register", methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error":"Username , Email and password are required"}), 400
    
    print(email , mongo.db.users.find_one({email: email}))
    if mongo.db.users.find_one({'email': email}):
        return jsonify({"error":"User already exist"}), 409
    
    hashed_password = generate_password_hash(password)

    user = User(username, email, hashed_password)
    result = mongo.db.users.insert_one(user.to_dict())

    access_token = create_access_token(identity=str(result.inserted_id))

    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id" : str(result.inserted_id),
            "username": username,
            "email": email,
            "budget":user.budget
        },
        "token": access_token
    }), 201


#login user
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error":"Username , Email and password are required"}), 400
    
    user = mongo.db.users.find_one({"email":email})

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    
    if not check_password_hash(user['password'],password):
        return jsonify({"error": "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=str(user['_id']))

    return jsonify({
        "message": "User login successfully",
        "token": access_token,
        "user":{"id":str(user.get('_id')),"username":user.get('username'),"email":user.get('email'),"budget":user.get('budget')}
    }), 201

#update monthyly_budget
@user_bp.route('/update_budget', methods=['PUT'])
@jwt_required()
def update_monthly_budget():
    user_id =  get_jwt_identity() 
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"error": "Not Authorised"}), 401
    
    data = request.get_json()
    budget = data.get('budget')
    if not budget:
        return jsonify({"error":"Budget not found"}), 400
    
    mongo.db.users.update_one({'_id':ObjectId(user_id)},{'$set': {'budget': budget}})
    return jsonify({"message":"monthly budget added"})


#current_user
@user_bp.route('/current_user', methods=['GET'])
@jwt_required()
def get_current_user():

    user_id =  get_jwt_identity() 

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    print(user)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "id": str(user.get("_id")),
        "username": user.get("username"),
        "email": user.get("email"),
        "budget":user.get('budget')
    }

    return jsonify({"user": user_data}), 200



    

