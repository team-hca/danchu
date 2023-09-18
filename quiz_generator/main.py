import logging
from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from textrank.utils import preprocess_titles
from textrank.utils import word_count
from textrank.summarizer import KeysentenceSummarizer
from datetime import datetime, timedelta
from config import MONGO_URI

# MongoDB 연결
client = MongoClient(MONGO_URI)
db = client.danchu
quiz_collection = db.daily_quiz.history
news_collection = db.news.history
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
@app.get("/api/v1/quiz/generatequiz")
def generate_quiz() :
    try:
        quiz = ""

        # 1. 최근 3일 간의 정답을 가져옴 (확인 완료)
        answers_three_days = get_answers()
        logging.info(answers_three_days)

        top_keyword = ""
        rank = 1

        # 현재 날짜와 시간을 가져옴
        today = datetime.today().strftime('%Y-%m-%d %H:%M:%S')

        while True :
            # 2. 이슈 키워드 가져와서 3일간의 정답과 비교 
            # (겹치면 키워드 다시 가져옴)
            tmp_keyword = ""
            tmp = keyword_collection.find({"rank": rank, "created_at": {"$gte": today}}, {"keyword": 1, "_id": 0})
            for document in tmp :
                tmp_keyword = document["keyword"]
                logging.info("tmp_keyword : " + tmp_keyword)

            if tmp_keyword in answers_three_days :
                rank += 1 # 다음 순위 키워드 찾으러 가기
            else : # tmp_keyword not in answers_three_days
                # 3. 이슈 키워드가 있는 제목만 가져오기
                title_json = get_titles_by_topkeyword(tmp_keyword)
                titles = [item["title"] for item in title_json] # json -> list
                logging.info("=====전처리 전 기사 제목 시작=====")
                for title in titles : logging.info(title)
                logging.info("=====전처리 전 기사 제목 끝=====")
                titles = preprocess_titles(titles) # 가져온 제목들 전처리
                titles = list(set(titles)) # 중복 제목 제거

                # 4. 제목에서 word count해서 상위 3개 키워드(정답) 뽑기
                # (이 때, 정답과 3일간의 정답이 겹치면 다시 2로)            
                quiz_answers = word_count(titles)
                logging.info("quiz_answers : " + quiz_answers[0] + ", " + quiz_answers[1] + ", " + quiz_answers[2]) # 퀴즈 정답 확인

                # 5. 3개 키워드가 모두 있는 제목만 필터링
                # (이 때, 결과가 0이면 상위 2개로만 필터링)            
                titles_filtered = []
                if quiz_answers[0] in answers_three_days or quiz_answers[1] in answers_three_days or quiz_answers[2] in answers_three_days : # 정답이 겹치면
                    rank += 1 #
                else :
                    top_keyword = tmp_keyword
                    for title in titles :
                        if quiz_answers[0] in title and quiz_answers[1] in title and quiz_answers[2] in title :
                            titles_filtered.append(title)
                
                    if len(titles_filtered) == 0 :
                        quiz_answers[2] = ""
                        for title in titles :
                            if quiz_answers[0] in title and quiz_answers[1] in title :
                                titles_filtered.append(title)
                        
                        if len(titles_filtered) == 0 :
                            quiz_answers[1] = ""
                            for title in titles :
                                if quiz_answers[0] in title :
                                    titles_filtered.append(title)
            
                logging.info(titles_filtered)
        
            if top_keyword != "" : 
                logging.info("top keyword : " + top_keyword)
                break # top keyword 정하면 끝냄

        # 6. 결과 중에서 퀴즈가 될 제목 선택 (text rank)
        if len(titles_filtered) == 1 : # 정답으로 필터링한 제목이 하나면 바로 퀴즈로 선택
            quiz = titles_filtered[0]
        else :
            # text rank로 제목 선택
            keysents = summarizer.summarize(titles_filtered, topk=1)

            for _, _, title in keysents: quiz = title
    
        logging.info(quiz)

        # 7. 퀴즈와 정답을 mongo db에 저장
        quiz_today = {
            "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"), # 다음날 날짜
            "quiz": quiz,
            "word1": quiz_answers[0],
            "word2" : quiz_answers[1],
            "word3" : quiz_answers[2],
            "created_at" : datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "modified_at" : datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        quiz_collection.insert_one(quiz_today)

        logging.info("quiz : " + quiz + ", answer1 : " + quiz_answers[0] + ", answer2 : " + quiz_answers[1] + ", answer3 : " + quiz_answers[2])
        
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        raise HTTPException(status_code=400, detail="BAD REQUEST")
