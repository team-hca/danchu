import FastText
import time
import os
from pymongo import MongoClient
from datetime import datetime, timedelta

dir = os.path.dirname(os.path.abspath(__file__))

#필요한 것 빼고 주석걸고 돌리기

# 하위 폴더 이름을 지정
subfolderName = "text"

# 하위 폴더의 경로를 생성
subfolderPath = os.path.join(dir, subfolderName)

# MongoDB 서버에 연결
client = MongoClient("mongodb://hca:danchu1213!@j9a302.p.ssafy.io:27017/?authMechanism=DEFAULT")

# 데이터베이스 선택
db = client.danchu

# 컬렉션 선택
similarityCollectionInput = db.daily_words_similarity_top1000
similarityCollectionOutput = db.daily_words_similarity_top1000.history
quizCollectionOutput = db.daily_quiz.history

#print(subfolderPath)S

#start = time.time()

# 결과를 저장할 출력 파일
#outputFile = os.path.join(subfolderPath, 'wiki_merged_file.txt')

# 파일합치기는 필요하면 추가
# 1. 불용어처리
# 2. 모델 재학습 (내일 모델이 만들어지는 것) (하루치 뉴스로 모델만들거면 3.에 추가)
# 3. 정답들 받아오기 (db든.. api든 뭐든)
# 4. 새로운 모델로 정답들 탑 1000 뽑고 몽고db에 넣기
# 5. 날짜가 바뀌면, 모델 교체
# 병합할 입력 파일 목록
# for i in range(1, 18) :
#     inputFile = os.path.join(subfolderPath, f'wiki_part{i}_extract.txt')
#     FastText.mergeTextFiles(inputFile, outputFile)
# end = time.time()
# print(end - start)

# 이거 들어오는 텍스트 이름 따라 수정
#1. 불용어처리
# start = time.time()
# FastText.doTextCleaning(os.path.join(subfolderPath,"merge_all_form_1.txt"), os.path.join(subfolderPath,"merge_all_form_1_cleaning.txt"))
# end = time.time()
# print(end - start)

# 2. 모델 재학습 (내일 모델이 만들어지는 것) (하루치 뉴스로 모델만들거면 3.에 추가)
# start = time.time()
# FastText.doModelLearning(os.path.join(subfolderPath,"merge_all_form_1_cleaning.txt"))
# end = time.time()
# print(end - start)

# 정답들 받아오기

# start = time.time()
# FastText.findWordSimilarity('화재', '강남')
# end = time.time()
# print(end - start)

# 정답들 몽고db에서 꺼내오기
# start = time.time()
findData = quizCollectionOutput.find({"date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")}, {'word1':1,'word2':1,"word3":1, '_id': 0})
# findData = quizCollectionOutput.find({"date": '2023-09-01'}, {'word1':1,'word2':1,"word3":1, '_id': 0})
answers = []

for docu in findData:
    answers.append(docu['word1'])
    answers.append(docu['word2'])
    answers.append(docu['word3'])
    
#print(*answers)

# end = time.time()
# print(end - start)

# 새로운 모델로 정답들 탑 1000 뽑고 몽고db에 넣기
# start = time.time()
answerMostSimilarities = []
for i in range(len(answers)):
    if answers[i] :
        answerMostSimilarities.append(FastText.findWordSimilarityTop1000(answers[i]))
    else : 
        #단어가 3개가 아닐 경우 처리
        answerMostSimilarities.append({'정답': ' ', '유사도 높은 순 1000': ' '})
    # answer1MostSimilarities = FastText.findWordSimilarityTop1000(answers[0])
    # answer2MostSimilarities = FastText.findWordSimilarityTop1000(answers[1])
    # answer3MostSimilarities = FastText.findWordSimilarityTop1000(answers[2])

#print(len(answerMostSimilarities))

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

# end = time.time()
# print(end - start)


#db에서 꺼내와보기
#<pymongo.cursor.Cursor object at 0x0000019F49DC1090>
# start = time.time()
# 조건, 가져올 필드 선택 1이 가져오는거 0이 제외
# findData = similarityCollectionOutput.find({"date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")}, {"word1_top1000" : 1, "word2_top1000":1, "word3_top1000":1, '_id': 0})

# for docu in findData:
#     print(docu)

# end = time.time()
# print(end - start)

# 5. 날짜가 바뀌면, 모델 교체
# FastText.changeModel()
