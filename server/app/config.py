from dotenv import load_dotenv
from datetime import timedelta
import os

load_dotenv()

class Config:
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=60)
    MONGO_URI = os.getenv("MONGODB_URI")
    TESTING = False

