from pymongo import MongoClient
from config import MONGO_URI
import pytz
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)

# 시간대 설정
korea_tz = pytz.timezone('Asia/Seoul') 

class QuizDao:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client.danchu
        self.quiz_collection = self.db.daily_quiz.history
        self.keyword_collection = self.db.daily_keyword.history

    def get_answers(self):
        # MongoDB에서 최근 3일 간의 key가 "word1", "word2", "word3"인 값을 가져오기
        tmp = self.quiz_collection.find({
            "date": {
                "$in": [datetime.now(korea_tz).strftime("%Y-%m-%d"),
                        (datetime.now(korea_tz) - timedelta(days=1)).strftime("%Y-%m-%d"),
                        (datetime.now(korea_tz) - timedelta(days=2)).strftime("%Y-%m-%d")]
            }
        },
            {
                "word1": 1, "word2": 1, "word3": 1, "_id": 0
            })

        quiz_answers = []
        for document in tmp:
            quiz_answers.append(document["word1"])
            quiz_answers.append(document["word2"])
            quiz_answers.append(document["word3"])

        logging.info("최근 3일간의 정답 조회 완료")

        return quiz_answers

    def insert_quiz(self, quiz_data):
        self.quiz_collection.insert_one(quiz_data)

class KeywordDao:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client.danchu
        self.keyword_collection = self.db.daily_keyword.history

    def find_keyword_by_rank_and_date(self, rank, date):
        return self.keyword_collection.find_one({"rank": rank, "created_at": {"$gte": date}}, {"keyword": 1, "_id": 0})
    
class NewsDao:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client.danchu
        self.news_collection = self.db.news.history

    def find_titles_by_date_and_keyword(self, date, keyword):
        return list(self.news_collection.find({
            "date": date,
            "title": {"$regex": keyword, "$options": "i"}
        }, {"title": 1, "_id": 0}))
