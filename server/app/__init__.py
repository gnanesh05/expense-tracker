from flask import Flask
from flask_cors import CORS
from .routes import register_routes
from .config import Config
from .helper import mongo,jwt

#app factory pattern
def create_app(test_config=None):
    app = Flask(__name__)

    app.config.from_object(Config)
    #for testing
    if test_config:
        app.config.update(test_config)
    mongo.init_app(app)
    jwt.init_app(app)
    CORS(app,supports_credentials=True)
    register_routes(app)
    return app