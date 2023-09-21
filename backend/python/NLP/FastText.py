#pip install 후 사용

import re
import json
from gensim.models import FastText
#from gensim import models
from mecab import MeCab
import os
from datetime import datetime, timedelta
import time
from tqdm import tqdm


dir = os.path.dirname(os.path.abspath(__file__))

# 하위 폴더 이름을 지정
subfolderName = "text"

# 하위 폴더의 경로를 생성
subfolderPath = os.path.join(dir, subfolderName)

# 현재 날짜를 가져오기
today = datetime.now()

# 이미 학습된 모델 가져오기
#modelName = 'ft'+str(today.strftime('%y%m%d'))+'.model'
#model = FastText.load(modelName)
model = FastText.load('ft230920_3.model')
#model = models.fasttext.load_facebook_model('cc.ko.300.bin.gz')

mecab = MeCab()

# 텍스트 파일 합치는 코드
def mergeTextFiles(inputFile, outputFile):
  try:
    #print(subfolderPath)
    with open(outputFile, 'w', encoding='utf-8') as outfile:
      
      # 병합할 입력 파일 목록
      for i in range(1, 5) :
        # if i == 48 or i == 54:
        #   continue
        inputFile = os.path.join(subfolderPath, f'merge_all_form_{i}.txt')

        with open(inputFile, encoding='utf-8') as infile:
          outfile.write(infile.read())
  except OSError as e:
    return e
  else:
    return 'text 합치기 완료'
  # 특수문자,한자,빈문자,영어, 숫자?
  # 일단 한국어 제외하고 다 없애버림
  # 숫자 걸러져서 '년, 월, 일, 개, 명, 만명, 세'만 남아버림. . . (6매, 290마력, 2계단, 188cm,20kg,3개동..)
  # ->보이는 것만이라도 불용어 처리

# 불용어 처리 -> 리스트에 담음
def doTextCleaning(inputFile,outputFile):
  try:
    with open(os.path.join(subfolderPath,'stopwords.txt'), 'r', encoding='utf-8') as f:
      listFile = f.readlines()
      stopwords = [listFile[i].strip() for i in range(len(listFile))]
      #print(stopwords)

    tokenTxtFile = open(outputFile, "w", encoding="utf-8")
    list = []

    with open(inputFile, 'r', encoding="utf-8") as f:
      docs = f.readlines()
      #num = 0
    
      for doc in tqdm(docs, desc="진행 중"):
        temp = doc.strip().split(',')
        result = []
      #'ㄱ-ㅎㅏ-ㅣ가-힣 ' 이외의 문자들 모두 제거. 바른에서 전처리하고 있음 근데 아직 다 안된 데이터가 있어서..전처리를 넣어둠
        for c in temp:
          c = re.sub("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]","",c)
          flag = True
          if flag and c and c not in stopwords: #빈 경우, 불용어인 경우 제외
            for li in mecab.pos(c):
              if 'NNP' == li[1]:
                flag = False
                break

          if flag:
            result.append(c)
          flag = True
        if result: #빈 경우 제외
          list.append(result)
        #프린트. . 메모리를 많이 잡아먹어서 메모리 뻑날수도있음
        #로그사용
        print(list)
        #print(result)
        #num += 1
        #print()
        #print(num)

    myJsonString = json.dumps(list, ensure_ascii=False)
    tokenTxtFile.write(myJsonString)
  except OSError as e:
    #throw 같은 것
    raise e
  else:
    return '전처리 완료'
  
#데이터로 모델 생성
def createModel(inputFile):
  try:
    with open(inputFile, 'r', encoding="utf-8") as f:
        text = f.readlines()
        data = json.loads(text[0])

    # 임베딩 프로세스에 대한 tqdm 프로그레스 바를 생성합니다.
    with tqdm(total=7, desc="임베딩 훈련 중") as pbar:
        embedding = FastText(data, vector_size=150, window=5, negative=5, epochs=7, min_count=5, workers=5, sg=1)

        # 각 에포크가 완료될 때마다 프로그레스 바를 업데이트합니다.
        for _ in range(7):
            embedding.train(data, total_examples=len(data), epochs=1)
            pbar.update(1)

    newModelName = 'ft' + str(today.strftime('%y%m%d')) + '.model'
    embedding.save(newModelName)  # 임베딩 모델을 저장합니다.

  except OSError as e:
     # OSError를 처리합니다.
      raise e
  else:
      print('학습 완료')

#모델 교체
def changeModel():
  global model
  #다음날 모델이 생성된 경우, 바꾸기
  modelName = 'ft'+str((today+timedelta(days=1)).strftime('%y%m%d'))+'.model'
  model = FastText.load(modelName)

#내일 사용할 모델을..할텐데  
#데이터로 모델 학습
# 수정 필요
def doModelLearning(inputFile):
  try:
    with open(inputFile, 'r', encoding="utf-8") as f:
        text = f.readlines()
        data = json.loads(text[0])

    # 임베딩 프로세스에 대한 tqdm 프로그레스 바를 생성합니다.
    with tqdm(total=7, desc="임베딩 훈련 중") as pbar:
        embedding = FastText(data, vector_size=150, window=5, negative=5, epochs=7, min_count=5, workers=5, sg=1)

        # 각 에포크가 완료될 때마다 프로그레스 바를 업데이트합니다.
        for _ in range(7):
            embedding.train(data, total_examples=len(data), epochs=1)
            pbar.update(1)

    newModelName = 'ft' + str(today.strftime('%y%m%d')) + '_3.model'
    embedding.save(newModelName)  # 임베딩 모델을 저장합니다.

  except OSError as e:
    # OSError를 처리합니다.
    raise e
  else:
    print('학습 완료')
  
# 고유명사 처리 -> 리스트에 담음
def doTextCleaningNNP(inputFile,outputFile):
  try:
    tokenTxtFile = open(outputFile, "w", encoding="utf-8")
    list = []

    with open(inputFile, 'r', encoding="utf-8") as f:
      docs = f.readlines()

      #문장
      for doc in docs:
        temp = doc.strip().split(',')
        result = []

        #단어
        # 고유명사 제거
        for c in temp:
          #print(c)
          c = re.sub("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]","",c)
          #print(c)
          flag = True
          if flag and c :
            for li in mecab.pos(c): 
              # print(li)
              if 'NNP' == li[1]:
                flag = False
                break

          if flag:
            result.append(c)
          flag = True
          #print(result)
        if result: #빈 경우 제외
          list.append(result)
        print(*list)

    myJsonString = json.dumps(list, ensure_ascii=False)
    tokenTxtFile.write(myJsonString)
  except OSError as e:
    #throw 같은 것
    raise e
  else:
    return '전처리 완료' 

#정답 단어의 유사도 1000위까지 뽑기
#만개 디비에 넣어둘까?
def findWordSimilarityTop1000(answer):
  try:
    #총 단어의 개수 : 235698 인듯 -> 위키만 학습한 모델 기준
    #<class 'list'>
    similarWords=model.wv.most_similar(answer,topn=1000) 

    similarWordsToJson = json.dumps(similarWords, ensure_ascii=False)

    wordSimilarityTop1000RespDto = {'정답': answer, '유사도 높은 순 1000': similarWordsToJson}

  except OSError as e:
    #throw 같은 것
    raise e
  else:
    return wordSimilarityTop1000RespDto
  
# def findWordSimilarityTop1000(answer):
#   try:
#     #총 단어의 개수 : 235698 인듯 -> 위키만 학습한 모델 기준
#     #<class 'list'>
#     similarWords=model.wv.most_similar(answer,topn=10000)
#     #similarWords = model.similar_by_word(answer,1000)

#     similarWordsToReturn =[]

#     # 근데 이거 정답단어가 고유명사가 아닐 때만 해줘야하려나?? 

#     # 일단 냅다 많이 뽑기
#     # NNG : 일반명사, NNP: 고유명사, NNB : 의존명사, NR : 수사, NP : 대명사
#     # for문 돌면서 뽑은 단어가 고유명사(NNP)인지 체크
#     # 고유명사가 아니라면, 내가 반환할 리스트에 추가해주기
#     # 고유명사라면 유사도 높은 것 더 뽑아서 채워넣기

#     while len(similarWordsToReturn) < 1000:
#       #print("in while")
#       #print(similarWords[0])
#       flag = True

#       for similarWord, similarity in similarWords:
#         #print("in for")
#         #print(similarWord)
#         #print(type(mecab.pos(similarWord)))
#         if flag:

#           # 만약, 단어 안에 정답단어가 들어있다면 넣지 않게 하기
#           if answer in similarWord:
#             continue
      
#           #print(mecab.pos(similarWord))
#           #고유명사면
        
#           for li in mecab.pos(similarWord):
#             #print(li[1])
#             if 'NNP' == li[1]:
#               flag = False
#               break
          
#           #print(mecab.pos(similarWord))
#           #고유명사아니면
#         if flag:
#           print(mecab.pos(similarWord))
#           similarWordsToReturn.append((similarWord,similarity))
#         flag = True
#           #print(len(similarWordsToReturn))

#         #반복문 다 돌아도 안되는거라면 
#       break

#     # 얘도 문제
#     print(len(similarWordsToReturn))
    
#     #print("out while")
#     similarWordsToJson = json.dumps(similarWordsToReturn, ensure_ascii=False)
#     # print('list')
#     # print(*similarWords)
#     #print(similarWordsToJson)
#     #print('jsonType' + type(similarWordsToJson))

#     wordSimilarityTop1000RespDto = {'정답': answer, '유사도 높은 순 1000': similarWordsToJson}

#     # for js in similarWordsToJson:
#     #   print(js)

#   except OSError as e:
#     #throw 같은 것
#     raise e
#   else:
#     return wordSimilarityTop1000RespDto
 
 
#쓰여진 단어에 대해 유사도 등수 + 유사도 뽑아주기
def findWordSimilarity(answer,inputWord):
  try:
    # 실수(float)입니다. 이 값은 -1에서 1 사이의 범위에 있으며, 두 단어나 단어 벡터가 유사할수록 값이 더 큽니다. 0은 두 단어나 단어 벡터가 관련이 없음을 나타냅니다.
    similarityBetweenWords = model.wv.similarity(answer, inputWord)
    #similarityBetweenWords = model.similarity(answer,inputWord)

    print(similarityBetweenWords)
    # <class 'numpy.float32'>
    #print(type(similartyBetweenWords))
    wordSimilarityRespDto = {'정답': answer,'입력값':inputWord,'유사도': similarityBetweenWords.astype(float), '순위':-1}
    similarWords=model.wv.most_similar(answer,topn=1000)
    #similarWords = model.similar_by_word(answer,1000)

    # 1000개 안에 있을 경우에만 해주자
    for idx, (similarWord, similarity) in enumerate(similarWords):
      if similarWord == inputWord:
        wordSimilarityRespDto['순위'] = idx + 1
        print(f"{idx + 1}위")
        break
  except OSError as e:
    #throw 같은 것
    raise e
  else:
    return wordSimilarityRespDto
