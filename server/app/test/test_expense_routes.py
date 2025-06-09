import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import pytest
import mongomock
from datetime import datetime
from app import create_app
from app.helper import mongo
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

def test_get_expenses(client):
    # Register user and get token, user_id
    register = client.post('/api/users/register', json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "test123"
    })
    data = register.get_json()
    token = data['token']
    user_id = data['user']['id']

    # Insert some expenses directly into DB for this user
    mongo.db.expenses.insert_many([
        {
            "user_id": user_id,
            "category": "Food",
            "description": "Lunch",
            "amount": 10,
            "timestamp": datetime.utcnow()
        },
        {
            "user_id": user_id,
            "category": "Transport",
            "description": "Bus ticket",
            "amount": 2.5,
            "timestamp": datetime.utcnow()
        }
    ])

    # Call GET expenses route
    response = client.get('/api/expenses/', headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    expenses = response.get_json().get('expenses')
    assert isinstance(expenses, list)
    assert any(e['category'] == "Food" for e in expenses)
    assert any(e['category'] == "Transport" for e in expenses)


def test_insert_expense(client):
    # Register user and get token, user_id
    register = client.post('/api/users/register', json={
        "username": "testuser2",
        "email": "test2@example.com",
        "password": "test123"
    })
    data = register.get_json()
    token = data['token']
    user_id = data['user']['id']

    # Expense data
    expense_data = {
        "category": "Entertainment",
        "description": "Movie ticket",
        "amount": 15
    }

    # Call POST insert expense
    response = client.post('/api/expenses/',
                           json=expense_data,
                           headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    resp_json = response.get_json()
    assert resp_json['message'] == "expense successfully added"
    expense = resp_json['expense']
    assert expense['category'] == "Entertainment"
    assert expense['description'] == "Movie ticket"
    assert float(expense['amount']) == 15
    assert expense['user_id'] == user_id or expense['user_id'] == str(user_id)  # depending on your stored format

    # Verify expense in DB
    db_expense = mongo.db.expenses.find_one({"_id": ObjectId(expense['id'])})
    assert db_expense is not None
    assert db_expense['category'] == "Entertainment"


def test_update_expense(client):
    # Register user and get token, user_id
    register = client.post('/api/users/register', json={
        "username": "testuser3",
        "email": "test3@example.com",
        "password": "test123"
    })
    data = register.get_json()
    token = data['token']
    user_id = data['user']['id']

    # Insert expense to update
    expense_id = mongo.db.expenses.insert_one({
        "user_id": user_id,
        "category": "Books",
        "description": "Python book",
        "amount": 20,
        "timestamp": datetime.utcnow()
    }).inserted_id

    update_data = {
        "category": "Books & Magazines",
        "description": "Advanced Python book",
        "amount": 25
    }

    # Call PUT update expense
    response = client.put(f'/api/expenses/?id={str(expense_id)}',
                          json=update_data,
                          headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    resp_json = response.get_json()
    assert resp_json['message'] == "expense updated"
    expense = resp_json['expense']
    assert expense['category'] == "Books & Magazines"
    assert expense['description'] == "Advanced Python book"
    assert float(expense['amount']) == 25
    assert expense['id'] == str(expense_id)

    # Verify update in DB
    updated = mongo.db.expenses.find_one({"_id": expense_id})
    assert updated['category'] == "Books & Magazines"


def test_delete_expense(client):
    # Register user and get token, user_id
    register = client.post('/api/users/register', json={
        "username": "testuser4",
        "email": "test4@example.com",
        "password": "test123"
    })
    data = register.get_json()
    token = data['token']
    user_id = data['user']['id']

    # Insert expense to delete
    expense_id = mongo.db.expenses.insert_one({
        "user_id": user_id,
        "category": "Gadgets",
        "description": "Mouse",
        "amount": 30,
        "timestamp": datetime.utcnow()
    }).inserted_id

    # Call DELETE expense
    response = client.delete(f'/api/expenses/?id={str(expense_id)}',
                             headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    resp_json = response.get_json()
    assert resp_json['message'] == "expense deleted"

    # Verify deletion in DB
    deleted = mongo.db.expenses.find_one({"_id": expense_id})
    assert deleted is None