import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import pytest
import mongomock
from app import create_app
from app.helper import mongo
from flask_jwt_extended import create_access_token
from bson import ObjectId

@pytest.fixture
def client():
    test_config = {
        "TESTING": True,
        "MONGO_URI":os.getenv("MONGODB_TEST_URI"),  # Dummy URI
        "JWT_SECRET_KEY": "test-secret"
    }

    app = create_app(test_config)

    with app.test_client() as client:
        with app.app_context():
            # Inject mongomock DB in place of real DB
            mongo.db = mongomock.MongoClient().db_name
        yield client
    mongo.cx.drop_database("expense_test_db")

def test_register_success(client):
    response = client.post('/api/users/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "test123"
    })
    data = response.get_json()
    assert response.status_code == 201
    assert data['message'] == "User registered successfully"
    assert 'token' in data

def test_register_duplicate_email(client):
    # Register once
    client.post('/api/users/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "test123"
    })
    # Register again
    response = client.post('/api/users/register', json={
        "username": "testuser2",
        "email": "test@example.com",
        "password": "test123"
    })
    assert response.status_code == 409
    assert response.get_json()['error'] == "User already exist"

def test_login_success(client):
    # Setup
    client.post('/api/users/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "test123"
    })

    response = client.post('/api/users/login', json={
        "email": "test@example.com",
        "password": "test123"
    })
    data = response.get_json()
    assert response.status_code == 201
    assert data['message'] == "User login successfully"
    assert 'token' in data

def test_login_invalid_password(client):
    client.post('/api/users/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "correctpass"
    })

    response = client.post('/api/users/login', json={
        "email": "test@example.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401
    assert response.get_json()['error'] == "Invalid email or password"

def test_update_budget(client):
    # Setup and login
    register = client.post('/api/users/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "test123"
    })
    user_id = register.get_json()['user']['id']
    token = register.get_json()['token']

    response = client.put('/api/users/update_budget',
        json={"budget": "5000"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.get_json()['message'] == "monthly budget added"

    # Verify update
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    assert user['budget'] == "5000"

def test_get_current_user(client):
    register = client.post('/api/users/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "test123"
    })
    token = register.get_json()['token']

    response = client.get('/api/users/current_user',
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data['user']['username'] == "testuser"
    assert data['user']['email'] == "test@example.com"