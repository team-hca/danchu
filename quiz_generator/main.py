from fastapi import FastAPI
from pymongo import MongoClient
from textrank.utils import preprocess_titles
from textrank.utils import word_count
from textrank.summarizer import KeysentenceSummarizer

# MongoDB 연결
client = MongoClient('localhost', 27017)
db = client.test_mongodb

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
    titles = list(db.articles.find({}, {"title": 1, "_id": 0}))
    return titles

@app.get("/get-topkeyword-titles")
def get_titles_by_topkeyword(topkeyword: str) :
    titles = list(db.articles.find({"title": {"$regex": topkeyword, "$options": "i"}}, {"title": 1, "_id": 0}))
    return titles

@app.get("/generate-quiz-by-keyword")
def generate_quiz(keyword) :
    # return : [quiz, [answer1, answer2, answer3]]
    result = []

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
    
    result.append(quiz_answers)

    return result
