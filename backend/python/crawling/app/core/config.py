# config.py
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
COLLECTION_NAME = os.environ.get("COLLECTION_NAME")

# 날짜 설정
CURRENT_DATE_TIME = datetime.datetime.now()
CURRENT_DATE = int(CURRENT_DATE_TIME.strftime("%Y%m%d"))
START_DATE = CURRENT_DATE
END_DATE = START_DATE
