from fastapi import FastAPI
from pymongo import MongoClient

# MongoDB 연결
client = MongoClient('localhost', 27017)
db = client.test_mongodb

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/get-all-titles")
def get_titles() :
    titles = list(db.articles.find({}, {"title": 1, "_id": 0}))
    return titles

@app.get("/get-topkeyword-titles")
def get_titles_by_topkeyword(topkeyword: str) :
    titles = list(db.articles.find({"title": {"$regex": topkeyword, "$options": "i"}}, {"title": 1, "_id": 0}))
    return titles

# @app.get("/get-answer-keywords")
# def get_answer_keywords() :

# @app.get("/get-answer-title")
