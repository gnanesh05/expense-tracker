class User:
    def __init__(self, username, email, password_hashed):
        self.username = username
        self.email = email
        self.password = password_hashed
        self.budget = 0

    def to_dict(self):
        return {
            "username" : self.username,
            "email" : self.email,
            "password" : self.password,
            "monthly_budget": self.budget
        }
