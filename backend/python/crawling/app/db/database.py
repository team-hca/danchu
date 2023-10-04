# database.py

from app.core import config
import motor.motor_asyncio
from pymongo import ASCENDING
import pandas as pd


# DB 초기화 함수
async def initialize_db():
    # 비동기 MongoClient를 사용합니다.
    client = motor.motor_asyncio.AsyncIOMotorClient(config.MONGO_URL)
    db = client[config.DB_NAME]
    collection = db[config.COLLECTION_NAME]
    await collection.create_index("crawled")  # 비동기로 인덱스 생성
    return collection


async def fetch_uncrawled_documents(crawled: str):
    collection = await initialize_db()
    query = {"crawled": crawled}
    sort_fields = [("date", ASCENDING), ("created_at", ASCENDING)]
    documents = (
        await collection.find(query).sort(sort_fields).to_list(None)
    )  # fetch up to 1000 documents
    return documents


# 특정 에러 코드 도큐먼트 반환 함수
async def fetch_error_documents(status: str):
    collection = await initialize_db()
    query = {"status": status}
    sort_fields = [("date", ASCENDING), ("created_at", ASCENDING)]
    documents = (
        await collection.find(query).sort(sort_fields).to_list(None)
    )  # fetch up to 1000 documents
    return documents


async def update_document_in_db(document_id, update_data):
    collection = await initialize_db()
    try:
        await collection.update_one({"_id": document_id}, {"$set": update_data})
    except Exception as e:
        print(f"데이터베이스 업데이트 중 에러: {e}")


async def fetch_all_documents_from_db():
    collection = await initialize_db()
    documents = await collection.find({}).to_list(None)
    return pd.DataFrame(documents)


async def insert_dataframe_into_db(df):
    collection = await initialize_db()
    documents = df.to_dict(orient="records")
    if documents:  # 목록이 비어 있지 않은 경우만 DB에 삽입
        await collection.insert_many(documents)
