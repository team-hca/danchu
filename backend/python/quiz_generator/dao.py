from pymongo import MongoClient
from config import MONGO_URI

class QuizDao:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client.danchu
        self.quiz_collection = self.db.daily_quiz.history
        self.keyword_collection = self.db.daily_keyword.history

    def insert_quiz(self, quiz_data):
        self.quiz_collection.insert_one(quiz_data)

class KeywordDao:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client.danchu
        self.keyword_collection = self.db.daily_keyword.history

    def find_keyword_by_rank_and_date(self, rank, date):
        return self.keyword_collection.find_one({"rank": rank, "created_at": {"$gte": date}}, {"keyword": 1, "_id": 0})