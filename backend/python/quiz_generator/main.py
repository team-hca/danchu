from pymongo import MongoClient

from config import MONGO_URI

# MongoDB 연결
client = MongoClient(MONGO_URI)
db = client.danchu
quiz_collection = db.daily_quiz.history
keyword_collection = db.daily_keyword.history

import pytz
from textrank.utils import preprocess_titles, get_titles_by_topkeyword, get_answers, word_count
from textrank.summarizer import KeysentenceSummarizer
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)

summarizer = KeysentenceSummarizer(
    tokenize = lambda x:x.split(),
    min_sim = 0.3,
    verbose = False
)

# 시간대 설정
korea_tz = pytz.timezone('Asia/Seoul') 
# 퀴즈 생성
rank = 1

while True : 
    try:
        quiz = ""

        # 1. 최근 3일 간의 정답을 가져옴 (확인 완료)
        answers_three_days = get_answers()

        top_keyword = ""

        # 현재 날짜와 시간을 가져옴
        today = datetime.now(korea_tz).strftime('%Y-%m-%d %H:%M:%S')
        today = today[:11] + "00:00:00"

        while True :
            # 2. 이슈 키워드 가져와서 3일간의 정답과 비교 
            # (겹치면 키워드 다시 가져옴)
            tmp_keyword = ""
            tmp = keyword_collection.find({"rank": rank, "created_at": {"$gte": today}}, {"keyword": 1, "_id": 0})
            for document in tmp :
                tmp_keyword = document["keyword"]

            if tmp_keyword in answers_three_days :
                rank += 1 # 다음 순위 키워드 찾으러 가기
            else : # tmp_keyword not in answers_three_days
                # 3. 이슈 키워드가 있는 제목만 가져오기
                title_json = get_titles_by_topkeyword(tmp_keyword)
                titles = [item["title"] for item in title_json] # json -> list
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
                    rank += 1
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
            
            if top_keyword != "" : 
                break # top keyword 정하면 끝냄

        # 6. 결과 중에서 퀴즈가 될 제목 선택 (text rank)
        if len(titles_filtered) == 1 : # 정답으로 필터링한 제목이 하나면 바로 퀴즈로 선택
            quiz = titles_filtered[0]
        else :
            # text rank로 제목 선택
            keysents = summarizer.summarize(titles_filtered, topk=1)
            for _, _, title in keysents: quiz = title

        # 7. 퀴즈와 정답을 mongo db에 저장
        quiz_today = {
            "date": (datetime.now(korea_tz) + timedelta(days=1)).strftime("%Y-%m-%d"), # 다음날 날짜
            "quiz": quiz,
            "word1": quiz_answers[0],
            "word2" : quiz_answers[1],
            "word3" : quiz_answers[2],
            "created_at" : datetime.now(korea_tz).strftime("%Y-%m-%d %H:%M:%S"),
            "modified_at" : datetime.now(korea_tz).strftime("%Y-%m-%d %H:%M:%S")
        }

        quiz_collection.insert_one(quiz_today)

        logging.info("quiz : " + quiz + ", answer1 : " + quiz_answers[0] + ", answer2 : " + quiz_answers[1] + ", answer3 : " + quiz_answers[2])
        break
            
    except Exception as e:
        logging.error(f"An error occurred: {e}")

        if str(e) == "object dtype is not supported by sparse matrices" : # 에러 발생 시 다음 코드 가져오기
            logging.info("다음 순위 키워드를 조회합니다.")
            rank += 1
        else : 
            logging.error(f"An error occurred: {e}")
            break