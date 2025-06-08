class Expense:
    def __init__(self,user_id, category,description,amount, timestamp):
        self.user_id = user_id
        self.category = category
        self.description = description
        self.amount = amount
        self.timestamp = timestamp

    def to_dict(self):
        return {
            "user_id" : self.user_id,
            "category": self.category,
            "description": self.description,
            "amount":self.amount,
            "timestamp":self.timestamp
        }
