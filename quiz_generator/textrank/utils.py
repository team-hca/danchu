from collections import Counter
from scipy.sparse import csr_matrix
from konlpy.tag import *
import re
import heapq

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
  result = []

  for title in titles :
    title = re.sub(r'\[.*?\]', '', title) # [] 제거
    title = re.sub(r'\(.*?\)', '', title) # () 제거
    title = title.strip() # 공백 strip
    result.append(title)

  return result

def word_count(titles) :
  okt = Okt()

  result = []
  noun_list = []

  for title in titles :
    tmp_list = okt.nouns(title) # 명사로 쪼개기
    noun_list += tmp_list

  tmp_dic = {}
  for noun in noun_list :
    if len(noun) > 1 :
      if noun not in tmp_dic : tmp_dic[noun] = 1
      else : tmp_dic[noun] += 1

  tmp_list = [(value * (-1), key) for key, value in tmp_dic.items()]
  heapq.heapify(tmp_list)

  for i in range(3) : # 빈도수 상위 3개 키워드
     _, keyword = heapq.heappop(tmp_list)
     result.append(keyword)

  return result

