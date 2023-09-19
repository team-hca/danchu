import logging
from collections import Counter
from scipy.sparse import csr_matrix
from konlpy.tag import *
import re
import heapq
from mecab import MeCab
from pymongo import MongoClient
from config import MONGO_URI
from datetime import datetime, timedelta
import pytz

# 시간대 설정
korea_tz = pytz.timezone('Asia/Seoul') 

# MongoDB 연결
client = MongoClient(MONGO_URI)
db = client.danchu
quiz_collection = db.daily_quiz.history
news_collection = db.news.history

logging.basicConfig(level=logging.INFO)

def scan_vocabulary(sents, tokenize=None, min_count=2):

    counter = Counter(w for sent in sents for w in tokenize(sent))
    counter = {w:c for w,c in counter.items() if c >= min_count}
    idx_to_vocab = [w for w, _ in sorted(counter.items(), key=lambda x:-x[1])]
    vocab_to_idx = {vocab:idx for idx, vocab in enumerate(idx_to_vocab)}
    return idx_to_vocab, vocab_to_idx

def tokenize_sents(sents, tokenize):
    return [tokenize(sent) for sent in sents]

def vectorize(tokens, vocab_to_idx):
    rows, cols, data = [], [], []
    for i, tokens_i in enumerate(tokens):
        for t, c in Counter(tokens_i).items():
            j = vocab_to_idx.get(t, -1)
            if j == -1:
                continue
            rows.append(i)
            cols.append(j)
            data.append(c)
    n_sents = len(tokens)
    n_terms = len(vocab_to_idx)
    x = csr_matrix((data, (rows, cols)), shape=(n_sents, n_terms))
    return x

def preprocess_titles(titles) : # 특수문자 안 내용 제거
  logging.info("기사 제목을 전처리합니다.")
  result = []

  for title in titles :
    title = re.sub(r'\[.*?\]', '', title) # [] 제거
    title = re.sub(r'\(.*?\)', '', title) # () 제거
    title = title.strip() # 공백 strip
    result.append(title)

  logging.info("기사 제목 전처리 완료")
  return result

def word_count(titles) :
  logging.info("기사 제목에서 word count를 합니다.")
  mecab = MeCab()

  result = []
  noun_list = []

  for title in titles :
     # 1. 띄어쓰기 단위로 split
    title_list = title.split()

    tmp_list = []
    for splited in title_list :
      splited_tuples = mecab.pos(splited)
      tmp_word = ''

      # 2. 품사가 NNP, NNG, XSN인 것만 이용
      for i in range(len(splited_tuples)) :
        splited_tuple = splited_tuples[i]
        if splited_tuple[1] in ['NNP', 'NNG', 'XSN'] :
          tmp_word += splited_tuple[0]
            
        else :
          if tmp_word != '' :
            tmp_list.append(tmp_word)
            tmp_word = ''
          
        if tmp_word != '' and i == len(splited_tuples) - 1 :
          tmp_list.append(tmp_word)
          tmp_word = ''

    noun_list += tmp_list

  tmp_dic = {}
  for noun in noun_list :
    if len(noun) > 1 :
      if noun not in tmp_dic : tmp_dic[noun] = 1
      else : tmp_dic[noun] += 1

  tmp_list = [(value * (-1), key) for key, value in tmp_dic.items()]
  heapq.heapify(tmp_list)

  while True : # 빈도수 상위 3개 키워드
    _, keyword = heapq.heappop(tmp_list)
    
    if len(result) == 0 :
     result.append(keyword)
    elif len(result) == 1 :
      if keyword not in result[0] and result[0] not in keyword :
        result.append(keyword)
    elif len(result) == 2 :
       if (keyword not in result[0] and result[0] not in keyword) and (keyword not in result[1] and result[1] not in keyword) : 
        result.append(keyword)
    else : break

  logging.info("기사 제목에서 word count 완료")
  return result

# 키워드로 제목 필터링
def get_titles_by_topkeyword(topkeyword: str) : 
    logging.info("빈도수 최상위 키워드로 기사 제목을 조회합니다.")
    today = datetime.now(korea_tz)

    # MongoDB에서 오늘 날짜에 해당하는 기사 가져오기
    titles = list(news_collection.find({
        "date" : today.strftime('%Y%m%d'),
        "title": {"$regex": topkeyword, "$options": "i"}
    }, {"title": 1, "_id": 0}))

    logging.info("기사 제목 조회 완료")
    return titles

# 지난 3일간의 정답 가져오기
def get_answers() :
    logging.info("최근 3일간의 정답을 조회합니다.")

    # MongoDB에서 최근 3일 간의 key가 "word1", "word2", "word3"인 값을 가져오기
    tmp = quiz_collection.find({
            "date": {
                "$in": [datetime.now(korea_tz).strftime("%Y-%m-%d"), 
                (datetime.now(korea_tz) - timedelta(days=1)).strftime("%Y-%m-%d"), 
                (datetime.now(korea_tz) - timedelta(days=2)).strftime("%Y-%m-%d")]
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

    logging.info("최근 3일간의 정답 조회 완료")

    return quiz_answers
