class User:
    def __init__(self, username, email, password_hashed):
        self.username = username
        self.email = email
        self.password = password_hashed

    def to_dict(self):
        return {
            "username" : self.username,
            "email" : self.email,
            "password" : self.password
        }
