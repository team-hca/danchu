import FastText
import time
import os
#import gensim
#from gensim.models import FastText
from typing import Union
from fastapi import FastAPI
from fastapi.responses import JSONResponse

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
@app.get("/api/v1/ai/wordSimilarityTop1000/{answer}")
def findWordSimilarityTop1000(answer : str):
    try:
        start = time.time()
        wordSimilarityTop1000RespDto = FastText.findWordSimilarityTop1000(answer)
    except OSError as e:
        return JSONResponse(content=e, status_code=400)

    else:
        end = time.time()
        print('걸린 시간:')
        print(end - start)
        return JSONResponse(content=wordSimilarityTop1000RespDto, status_code = 200)
