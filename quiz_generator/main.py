from fastapi import FastAPI
from pymongo import MongoClient
from textrank.utils import preprocess_titles
from textrank.utils import word_count
from textrank.summarizer import KeysentenceSummarizer
from datetime import datetime, timedelta

# MongoDB 연결
client = MongoClient('localhost', 27017)
news_db = client.test_mongodb
keyword_db = client.daily_keyword
quiz_db = client.daily_quiz

app = FastAPI()

summarizer = KeysentenceSummarizer(
    tokenize = lambda x:x.split(),
    min_sim = 0.3,
    verbose = False
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/get-all-titles")
def get_titles() :
    titles = list(news_db.articles.find({}, {"title": 1, "_id": 0}))
    return titles

@app.get("/get-topkeyword-titles")
def get_titles_by_topkeyword(topkeyword: str) :
    titles = list(news_db.articles.find({"title": {"$regex": topkeyword, "$options": "i"}}, {"title": 1, "_id": 0}))
    return titles

@app.get("/generate-quiz-by-keyword")
def generate_quiz(keyword) :
    # return : [quiz, [answer1, answer2, answer3]]
    result = []
    quiz = ""

    # 1. 정답이 될 키워드 찾기
    title_json = get_titles_by_topkeyword(keyword) # keyword가 들어간 제목들을 받아오기
    titles = [item["title"] for item in title_json]
    titles = preprocess_titles(titles) # 가져온 제목들 전처리
    titles = list(set(titles)) # 중복 제목 제거 (중복 때문에 제목이 추출되지 않도록)
    quiz_answers = word_count(titles) # 가져온 제목들에서 word count

    # 2. 정답 포함된 제목만 추출
    title_filtered = []
    answer01, answer02, answer03 = quiz_answers[0], quiz_answers[1], quiz_answers[2]

    for title in titles :
        if answer01 in title and answer02 in title and answer03 in title :
            title_filtered.append(title)

    # 제목들 중에서 추출
    keysents = summarizer.summarize(title_filtered, topk=1)

    for _, _, title in keysents:
        result.append(title)
        quiz = title
    
    result.append(quiz_answers)

    # MongoDB에 저장할 데이터 생성
    quiz_data = {
        "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"), # 다음날 날짜
        "quiz": quiz,
        "word1": answer01,
        "word2" : answer02,
        "word3" : answer03
    }

    # MongoDB에 저장
    quiz_db.history.insert_one(quiz_data)

    return result
