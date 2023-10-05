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

# 학습된 모델 가져오기
modelInNnp = FastText.load('ft230916_2.model')
modelNotNnp = FastText.load('ft230927_4.model')

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

# 불용어,고유명사 처리 -> 리스트에 담음
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
    
      for doc in tqdm(docs, desc="진행 중"):
        temp = doc.strip().split(',')
        result = []
      #'ㄱ-ㅎㅏ-ㅣ가-힣 ' 이외의 문자들 모두 제거. 바른에서 전처리하고 있음 근데 아직 다 안된 데이터가 있어서..전처리를 넣어둠
        for c in temp:
          c = re.sub("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]","",c)
          flag = True
          if c and c in stopwords: #불용어인 경우 제외
            flag = False

          if c and c not in stopwords:
            for li in mecab.pos(c): # +로 합쳐져서 나올 수도 있어서 .. 쪼개야함
              if '+' in li[1]:# 합쳐진 애면
                flag = False
                break
              #partsOfSpeech = li[1].split('+')
              #print(partsOfSpeech)
              #for part in partsOfSpeech:
              if li[1] != 'NNG': #일반명사가 아니라면
                #if 'NNP' == li[1]: #고유명사인 경우 제외
                flag = False
                break

          if flag and c: # 빈 경우 제외
            result.append(c)
          flag = True
        if result: #빈 경우 제외
          list.append(result)
        #프린트. . 메모리를 많이 잡아먹어서 메모리 뻑날수도있음
        #로그사용

    myJsonString = json.dumps(list, ensure_ascii=False)
    tokenTxtFile.write(myJsonString)
  except Exception as e:
    #throw 같은 것
    raise e
  else:
    print('전처리 완료')
  
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

def doModelLearning(inputFile):
  try:
    with open(inputFile, 'r', encoding="utf-8") as f:
      text = f.readlines()
      data = json.loads(text[0])

      #ft+날짜 ex : ft230912.model
      #내일 날짜로 새 모델 저장

      # 모델 재학습
      # lr은 학습률. 얼마나 큰 단계로 가중치를 업데이트할지 결정
      # 높은 학습률은 0.1이상 낮은 학습률을 0.01 이하
      # 학습률이 높으면 빠르게 학습하지만, 너무 높으면 발산?할 수 있음 
      # 낮으면 수렴할 가능성이 높지만 너무 오래걸릴 수도 있고 하한값에 갈 수도 o
      model.build_vocab(data, update=True) #단어 사전 업데이트
      model.train(data, total_examples=model.corpus_count, epochs=model.epochs) #모델 학습.

      # 새로운 모델을 저장
      newModelName = 'ft'+str((today).strftime('%y%m%d'))+'_4.model'
      model.save(newModelName)

  except Exception as e:
    #throw 같은 것
    raise e
  else:
    print('재학습 완료')

#정답 단어의 유사도 1000위까지 뽑기
def findWordSimilarityTop1000(answer, answerType):
  try:
    #<class 'list'>
    if answerType: #고유명사면
      #print("NNP")
      similarWords=modelInNnp.wv.most_similar(answer,topn=1000) 

    else: #고유명사아니면
      #print("NotNNp")
      similarWords=modelNotNnp.wv.most_similar(answer,topn=1000) 

    similarWordsToJson = json.dumps(similarWords, ensure_ascii=False)

    wordSimilarityTop1000RespDto = {'정답': answer, '유사도 높은 순 1000': similarWordsToJson}

  except OSError as e:
    #throw 같은 것
    raise e
  else:
    return wordSimilarityTop1000RespDto
  
#쓰여진 단어에 대해 유사도 등수 + 유사도 뽑아주기
def findWordSimilarity(answer,inputWord):
  try:
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

    print(answerType)

    # 실수(float)입니다. 이 값은 -1에서 1 사이의 범위에 있으며, 두 단어나 단어 벡터가 유사할수록 값이 더 큽니다. 0은 두 단어나 단어 벡터가 관련이 없음을 나타냅니다.
    if answerType: #고유명사라면
      similarityBetweenWords = modelInNnp.wv.similarity(answer, inputWord)
    
    else: #고유명사가 아니라면
      similarityBetweenWords = modelNotNnp.wv.similarity(answer, inputWord)

    #print(similarityBetweenWords)
    # <class 'numpy.float32'>
    wordSimilarityRespDto = {'정답': answer,'입력값':inputWord,'유사도': similarityBetweenWords.astype(float), '순위':-1}

    if answerType: #고유명사면
      similarWords=modelInNnp.wv.most_similar(answer,topn=1000) 

    else: #고유명사아니면
      similarWords=modelNotNnp.wv.most_similar(answer,topn=1000) 

    # 1000개 안에 있을 경우에만 해주자
    for idx, (similarWord, similarity) in enumerate(similarWords):
      if similarWord == inputWord:
        wordSimilarityRespDto['순위'] = idx + 1
        print(f"{idx + 1}위")
        break
  except Exception as e:
    #throw 같은 것
    raise e
  else:
    return wordSimilarityRespDto
