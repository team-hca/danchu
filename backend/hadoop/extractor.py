from pymongo import MongoClient
import pprint
# from eunjeon import Mecab # 윈도우용
from konlpy.tag import Mecab # 리눅스용
import pytz
from datetime import datetime
from tqdm import tqdm
from typing import List
import time
import re

# 몽고DB 연결
client = MongoClient(host=<hostIp>, port=<port>, username=<MongoDBID>, password=<MongoDBPW>) # 접속
DB = client.danchu # DB 명
seoul_timezone = pytz.timezone('Asia/Seoul')
NOW_DATE = datetime.now(seoul_timezone).strftime("%Y%m%d") # 인자로 보낼 오늘 날짜 값

# 컬렉션 연결
Collection_keyword = DB.daily_keyword.history
Collection_news = DB.news.history


# 뉴스 컨텐츠 가져오기
# content = Collection_news.find({'date' : NOW_DATE}, {'_id':0, 'content': 1})
content = [doc['content'] for doc in Collection_news.find({'date': NOW_DATE}, {'_id': 0, 'content': 1})]


# 컬렉션 내용 Test
# for item in Collection_news.find({"date" : NOW_DATE}):
#     pprint.pprint(item['content'])
# for item in content:
#     pprint.pprint(item)

# 단어 추출 부분
mecab = Mecab() # Mecab 호출

file_out = f'/home/ubuntu/hadoop/bin/news{NOW_DATE}.txt' # 파일 저장 위치
# file_out = f'C:/Users/dbtjq/Desktop/coding/SSAFY_practice/ProjectA302/test.txt'


def text_processing(segment):
    p = re.compile("^</?doc")
    korean_pattern = re.compile('[가-힣]+')
    processed_lines = []
    for line in tqdm(segment):
        line = line.strip()
        if p.match(line) or line is None:
            continue
        
        words = mecab.nouns(line)
        nouns = [word for word in words if korean_pattern.search(word)] # 한글만 추출
        # nouns = [re.sub("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]", "", word) for word in mecab.nouns(line)] # 정규식 추가 이런 방식도 있음
        if nouns : 
            processed_lines.append(nouns)

    if processed_lines:
        tmp = [','.join(nouns) for nouns in processed_lines]
        data = '\n'.join(tmp)

        with open(file_out, 'a', encoding='UTF-8') as f:
            f.write(data)
    else :
        with open(file_out, 'a', encoding='UTF-8') as f:
            f.write("\n")
    
    print(f"{len(segment)} lines processing complete.")

if __name__ == "__main__":
    print(f'시작 시간 : {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    processed_line = 0
    start_time = time.time()

    # 전처리된 데이터를 쓸 파일 초기화
    with open(file_out, 'w', encoding='UTF-8'):
        pass

    # for item in tqdm(content):
    #     s_time = time.time()
    #     text_processing(item) # 반복 시
    #     processed_line += len(item)
    #     print(f"현재 처리된 라인 수 : {processed_line}")
    text_processing(content)

    print(f"총 소요 시간 : {time.time() - start_time} sec")
    # print(f'종료 시간 : {now.strftime("%Y-%m-%d %H:%M:%S")}')
