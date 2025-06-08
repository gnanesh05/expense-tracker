from flask import Flask
from flask_cors import CORS
from .routes import register_routes
from .config import Config
from .helper import mongo,jwt

#app factory pattern
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    mongo.init_app(app)
    jwt.init_app(app)
    CORS(app,supports_credentials=True)
    register_routes(app)
    return app