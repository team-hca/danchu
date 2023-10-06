# database.py

from app.core import config
import motor.motor_asyncio
from pymongo import ASCENDING
import pandas as pd


# DB 초기화 함수
async def initialize_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(config.MONGO_URL)
    db = client[config.DB_NAME]
    collection = db[config.COLLECTION_NAME]

    indexes = await collection.index_information()
    if "crawled_1" not in indexes:
        await collection.create_index("crawled")

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


async def fetch_documents_by_date_from_db(start_date: int, end_date: int):
    collection = await initialize_db()

    if start_date == end_date:
        query = {"date": str(start_date)}
    else:
        query = {"date": {"$gte": str(start_date), "$lte": str(end_date)}}

    documents = await collection.find(query).to_list(None)
    return pd.DataFrame(documents)


async def insert_dataframe_into_db(df):
    collection = await initialize_db()
    documents = df.to_dict(orient="records")
    if documents:  # 목록이 비어 있지 않은 경우만 DB에 삽입
        await collection.insert_many(documents)
