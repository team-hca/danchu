import logging
from fastapi import FastAPI
from pymongo import MongoClient
from textrank.utils import preprocess_titles
from textrank.utils import word_count
from textrank.summarizer import KeysentenceSummarizer
from datetime import datetime, timedelta

# MongoDB 연결
client = MongoClient('localhost', 27017)
db = client.danchu_test_db
news_collection = db.news.history
quiz_collection = db.daily_quiz.history
keyword_collection = db.daily_keyword.history

app = FastAPI()

logging.basicConfig(level=logging.INFO)

summarizer = KeysentenceSummarizer(
    tokenize = lambda x:x.split(),
    min_sim = 0.3,
    verbose = False
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


# 전체 기사 제목 출력
def get_titles() : 
    # 오늘의 날짜를 가져오기
    today = datetime.today().strftime('%Y%m%d')

    # today = "20230907"

    # MongoDB에서 오늘 날짜에 해당하는 기사 가져오기
    titles = list(news_collection.find({"date" : today}, {"title": 1, "_id": 0}))

    logging.info("=====전체 기사 제목 시작=====")
    for title in titles : logging.info(title)
    logging.info("=====전체 기사 제목 끝=====")

    return titles


# 키워드로 제목 필터링
def get_titles_by_topkeyword(topkeyword: str) : 

    # MongoDB에서 오늘 날짜에 해당하는 기사 가져오기
    titles = list(news_collection.find({
        "date" : datetime.today().strftime('%Y%m%d'),
        # "date" : "20230907",
        "title": {"$regex": topkeyword, "$options": "i"}
    }, {"title": 1, "_id": 0}))

    logging.info("=====키워드 필터링한 기사 제목 시작=====")
    for title in titles : logging.info(title)
    logging.info("=====키워드 필터링한 기사 제목 끝=====")

    return titles


# 지난 3일간의 저답 가져오기
def get_answers() :

    # MongoDB에서 최근 3일 간의 key가 "word1", "word2", "word3"인 값을 가져오기
    tmp = quiz_collection.find({
            "date": {
                "$in": [datetime.now().strftime("%Y-%m-%d"), 
                (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"), 
                (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d")]
            }
        }, 
        {
            "word1":1, "word2":1, "word3":1, "_id":0
        })

    quiz_answers = []
    for document in tmp : 
        quiz_answers.append(document["word1"])
        quiz_answers.append(document["word2"])
        quiz_answers.append(document["word3"])

    logging.info("=====최근 3일 정답 시작=====")
    for quiz_answer in quiz_answers : logging.info(quiz_answer)
    logging.info("=====최근 3일 정답 끝=====")

    return quiz_answers


# 퀴즈 생성
@app.get("/api/v1/question/generatequiz")
def generate_quiz() :
    try:

        quiz = ""

        # 1. 지난 3일간의 정답 가져오기
        answers_three_days = get_answers()

        # 2. 1위 키워드 가져오기 (그런데 3일 전 정답 중에 있으면 안됨 !)
        keyword = ""
        quiz_answers = []
        rank = 1
        titles = []

        while True :
            # 3. 정답이 될 키워드 찾기
            print("rank : " + str(rank))
            tmp = keyword_collection.find({"rank": rank}, {"keyword":1, "_id":0}) # 순위가 rank인 키워드 가져옴
            for document in tmp : keyword = document["keyword"]
            
            if keyword not in answers_three_days : # 키워드가 지난 정답 중에 없음 -> 키워드로 뽑은 정답과 지난 정답이 안 겹치는지 확인
                
                title_json = get_titles_by_topkeyword(keyword) # keyword가 들어간 제목들을 받아오기
                titles = [item["title"] for item in title_json] # json -> list
                titles = preprocess_titles(titles) # 가져온 제목들 전처리
                titles = list(set(titles)) # 중복 제목 제거 (제목이 중복 때문에 선택되지 않도록)
                quiz_answers = word_count(titles) # 가져온 제목들에서 word count

                cnt = 0
                for answer in quiz_answers :
                    if answer in answers_three_days : break
                    else : cnt += 1
                if cnt == len(quiz_answers) : break # 키워드로 뽑은 정답과 지난 정답이 겹치지 않음
            else : pass # 키워드가 3일간 정답 중에 있으면 
            
            rank += 1

        # 4. 정답 포함된 제목만 추출
        title_filtered = []

        for title in titles :
            if quiz_answers[0] in title and quiz_answers[1] in title and quiz_answers[2] in title :
                title_filtered.append(title)

        if len(title_filtered) == 0 :
            quiz_answers[2] = ""
            if quiz_answers[0] in title and quiz_answers[1] in title :
                title_filtered.append(title)
        
        # 제목들 중에서 추출
        keysents = summarizer.summarize(title_filtered, topk=1)

        for _, _, title in keysents:
            quiz = title

        # MongoDB에 저장할 데이터 생성
        quiz_data = {
            "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"), # 다음날 날짜
            "quiz": quiz,
            "word1": quiz_answers[0],
            "word2" : quiz_answers[1],
            "word3" : quiz_answers[2]
        }

        # MongoDB에 저장
        quiz_collection.insert_one(quiz_data)

        return {"quiz": quiz,
                "answers" : {
                    "word1": quiz_answers[0],
                    "word2": quiz_answers[1],
                    "word3": quiz_answers[2]
                    }
                }
    
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        raise HTTPException(status_code=400, detail="BAD REQUEST")


# 키워드 입력하여 퀴즈 생성
@app.get("/generate-quiz-by-keyword")
def generate_quiz(keyword) :
    try : 

        quiz = ""

        # 1. 정답이 될 키워드 찾기
        title_json = get_titles_by_topkeyword(keyword) # keyword가 들어간 제목들을 받아오기
        titles = [item["title"] for item in title_json]
        titles = preprocess_titles(titles) # 가져온 제목들 전처리
        titles = list(set(titles)) # 중복 제목 제거 (중복 때문에 제목이 추출되지 않도록)
        quiz_answers = word_count(titles) # 가져온 제목들에서 word count

        # 2. 정답 포함된 제목만 추출
        title_filtered = []

        for title in titles :
            if quiz_answers[0] in title and quiz_answers[1] in title and quiz_answers[2] in title :
                title_filtered.append(title)

        # 제목들 중에서 추출
        keysents = summarizer.summarize(title_filtered, topk=1)

        for _, _, title in keysents:
            quiz = title

        # MongoDB에 저장할 데이터 생성
        quiz_data = {
            "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"), # 다음날 날짜
            "quiz": quiz,
            "word1": quiz_answers[0],
            "word2" : quiz_answers[1],
            "word3" : quiz_answers[2]
        }

        # MongoDB에 저장
        quiz_collection.insert_one(quiz_data)

        return {"quiz": quiz,
                "answers" : {
                    "word1": quiz_answers[0],
                    "word2": quiz_answers[1],
                    "word3": quiz_answers[2]
                    }
                }
    
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        raise HTTPException(status_code=400, detail="BAD REQUEST")
