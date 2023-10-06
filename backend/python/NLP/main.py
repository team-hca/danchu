import FastText
import time
import os
#import gensim
#from gensim.models import FastText
from typing import Union
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from datetime import datetime, timedelta
from mecab import MeCab

mecab = MeCab()

dir = os.path.dirname(os.path.abspath(__file__))

#필요한 것 빼고 주석걸고 돌리기

# 하위 폴더 이름을 지정
subfolderName = "text"

# 하위 폴더의 경로를 생성
subfolderPath = os.path.join(dir, subfolderName)

app = FastAPI()
#시간은 나중에 빼도 됨 지금은 확인용

#model = gensim.models.FastText.load('fastText5.model')

#여기에서 모델 한번 호출 -> fastText에서 임포트

#인자에 파일명 추가
@app.get("/api/v1/ai/mergeTextFiles")
def mergeTextFiles():

    #print(subfolderPath)

    try:
        start = time.time()
    # 결과를 저장할 출력 파일
        outputFile = os.path.join(subfolderPath, 'merge_all_form_merged_file.txt')

        # 병합할 입력 파일 목록
        # 자동화시 바꿔야하는 부분. text 파일의 이름과 개수만큼 넣었다 (71)
        # 오류나는 부분도 수동으로 빼둠
        for i in range(1, 5) :
            # if i == 48 or i == 54:
            #   continue
            inputFile = os.path.join(subfolderPath, f'merge_all_form_{i}.txt')
            result = FastText.mergeTextFiles(inputFile, outputFile)
    except OSError as e:
        return JSONResponse(content=e, status_code=400)

    else:
        end = time.time()
        print('걸린 시간:')
        print(end - start)
        return JSONResponse(content=result, status_code = 200)



@app.get("/api/v1/ai/textCleaning/{inputFileName}")
#wiki_merged_file.txt
def doTextCleaning(inputFileName : str,):
    try:
        start = time.time()
        outputFileName = inputFileName.replace('.txt','')+'_cleaning.txt'
        result = FastText.doTextCleaning(os.path.join(subfolderPath,inputFileName), os.path.join(subfolderPath,outputFileName))
    except OSError as e:
        return JSONResponse(content=e, status_code=400)

    else:
        end = time.time()
        print('걸린 시간:')
        print(end - start)
        return JSONResponse(content=result, status_code = 200)

#wiki_merged_file_cleaning.txt
@app.get("/api/v1/ai/modelLearning/{inputFileName}")
def doModelLearning(inputFileName : str):

    try:
        start = time.time()
        result = FastText.createModel(os.path.join(subfolderPath,inputFileName))
    except OSError as e:
        return JSONResponse(content=e, status_code=400)

    else:
        end = time.time()
        print('걸린 시간:')
        print(end - start)
        return JSONResponse(content=result, status_code = 200)

#'화재', '강남'
@app.get("/api/v1/ai/wordSimilarity/{answer}/{word}")
def findWordSimilarity(answer : str, word : str):
    try:
        start = time.time()
        wordSimilarityRespDto = FastText.findWordSimilarity(answer, word)
    except OSError as e:
        return JSONResponse(content=e, status_code=400)

    else:
        end = time.time()
        print('걸린 시간:')
        print(end - start)
        return JSONResponse(content=wordSimilarityRespDto, status_code = 200)

#'화재'
@app.get("/api/v1/ai/wordSimilarityTop1000/{answer}/{anwerType}")
def findWordSimilarityTop1000(answer : str):
    try:
        start = time.time()
            # 입력값 고유명사 판단
        answerType = True
        for li in mecab.pos(answer): # +로 합쳐져서 나올 수도 있어서 .. 쪼개야함
            print(li[1])
            if '+' in li[1]:# 합쳐진 애면
                answerType = False
                break
            if li[1] != 'NNP': # 고유명사가 아니라면
                answerType = False
                break

        wordSimilarityTop1000RespDto = FastText.findWordSimilarityTop1000(answer, answerType)
    except OSError as e:
        return JSONResponse(content=e, status_code=400)

    else:
        end = time.time()
        print('걸린 시간:')
        print(end - start)
        return JSONResponse(content=wordSimilarityTop1000RespDto, status_code = 200)

@app.get("/api/v1/ai/todaySimilarity")
def findTodayWordsSimilarity():
    try:
        # MongoDB 서버에 연결
        client = MongoClient("mongodb://hca:danchu1213!@j9a302.p.ssafy.io:27017/?authMechanism=DEFAULT")

        # 데이터베이스 선택
        db = client.danchu

        # 컬렉션 선택
        similarityCollectionInput = db.daily_words_similarity_top1000
        quizCollectionOutput = db.daily_quiz.history

        # 정답들 몽고db에서 꺼내오기
        findData = quizCollectionOutput.find({"date": (datetime.now() + timedelta(days=0)).strftime("%Y-%m-%d")}, {'word1':1,'word2':1,"word3":1, 'word1_type':1, 'word2_type':1, 'word3_type':1, '_id': 0})

        answers = []
        answersTypes = []

        #print(*findData)
        #findData...한번만 꺼낼 수 있음
        for docu in findData:
            answers.append(docu['word1'])
            answers.append(docu['word2'])
            answers.append(docu['word3'])
            answersTypes.append(bool(docu['word1_type']))
            answersTypes.append(bool(docu['word2_type']))
            answersTypes.append(bool(docu['word3_type']))
        print(*answers)
        print(len(answers))
        print(*answersTypes)

        # 모델로 정답들 탑 1000 뽑고 몽고db에 넣기
        answerMostSimilarities = []

        for i in range(len(answers)):
            if answers[i] : #정답 단어가 비어있지 않다면
                #print("ok")
                #temp = FastText.findWordSimilarityTop1000(answers[i],answersTypes[i])
                answerMostSimilarities.append(FastText.findWordSimilarityTop1000(answers[i],answersTypes[i]))
                #print(temp['1000위'][1])

            else :
                #print("not")
                #단어가 3개가 아닐 경우 처리
                answerMostSimilarities.append({'정답': ' ', '유사도 높은 순 1000': ' ', '1000위': ' '})

        #db에 넣기
        similarityData = {
            "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"), # 다음날 날짜
            "word1": answers[0],
            "word2" : answers[1],
            "word3" : answers[2],
            "word1_type" : answersTypes[0],
            "word2_type" : answersTypes[1],
            "word3_type" : answersTypes[2],
            "word1_top1000" : answerMostSimilarities[0]['유사도 높은 순 1000'],
            "word2_top1000" : answerMostSimilarities[1]['유사도 높은 순 1000'],
            "word3_top1000" : answerMostSimilarities[2]['유사도 높은 순 1000'],
            "word1_1000" : answerMostSimilarities[0]['1000위'][1],
            "word2_1000" : answerMostSimilarities[1]['1000위'][1],
            "word3_1000" : answerMostSimilarities[2]['1000위'][1],
            "created_at" : datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "modified_at" : datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

        #MongoDB에 저장
        similarityCollectionInput.history.insert_one(similarityData)
    except OSError as e:
        return JSONResponse(content=e, status_code=400)

    else:
        return JSONResponse(content="성공", status_code = 200)

