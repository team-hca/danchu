import FastText
import time
import os
from pymongo import MongoClient
from datetime import datetime, timedelta

dir = os.path.dirname(os.path.abspath(__file__))

# MongoDB 서버에 연결
client = MongoClient("mongodb://hca:danchu1213!@j9a302.p.ssafy.io:27017/?authMechanism=DEFAULT")

# 데이터베이스 선택
db = client.danchu

# 컬렉션 선택
similarityCollectionInput = db.daily_words_similarity_top1000
similarityCollectionOutput = db.daily_words_similarity_top1000.history
quizCollectionOutput = db.daily_quiz.history

# 정답들 몽고db에서 꺼내오기
findData = quizCollectionOutput.find({"date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")}, {'word1':1,'word2':1,"word3":1, '_id': 0})

answers = []

for docu in findData:
    answers.append(docu['word1'])
    answers.append(docu['word2'])
    answers.append(docu['word3'])

# 새로운 모델로 정답들 탑 1000 뽑고 몽고db에 넣기
answerMostSimilarities = []
for i in range(len(answers)):
    if answers[i] :
        answerMostSimilarities.append(FastText.findWordSimilarityTop1000(answers[i]))
    else : 
        #단어가 3개가 아닐 경우 처리
        answerMostSimilarities.append({'정답': ' ', '유사도 높은 순 1000': ' '})

#db에 넣기
similarityData = {
    "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"), # 다음날 날짜
    "word1": answers[0],
    "word2" : answers[1],
    "word3" : answers[2],
    "word1_top1000" : answerMostSimilarities[0]['유사도 높은 순 1000'],
    "word2_top1000" : answerMostSimilarities[1]['유사도 높은 순 1000'],
    "word3_top1000" : answerMostSimilarities[2]['유사도 높은 순 1000'],
    "created_at" : datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "modified_at" : datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
}

#MongoDB에 저장
similarityCollectionInput.history.insert_one(similarityData)

