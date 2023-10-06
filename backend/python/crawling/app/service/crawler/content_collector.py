import httpx
from datetime import datetime
from tqdm import tqdm
import pandas as pd
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import asyncio
from app.db.database import (
    fetch_uncrawled_documents,
    update_document_in_db,
    fetch_error_documents,
)
from app.core import config

# 크롤링 방지 우회 설정 초기화
ua = UserAgent()
HEADERS = {"User-Agent": ua.random}

# pandas 출력 옵션 설정
pd.set_option("display.max_colwidth", None)


async def fetch_article_content(url: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=HEADERS)
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as e:
                # 에러 처리 로직 (예: 로깅, 기본값 반환 등)
                print(f"HTTP error occurred: {e}")
                if e.response.status_code == 302:
                    location = e.response.headers.get("location")
                    if location:
                        print(f"Redirect location: {location}")
                        return location
                    else:
                        print(f"Location header not found in the response")

            # bs 객체 생성
            soup = BeautifulSoup(response.text, "html.parser")

            # date_time 추출
            date_time_tag = soup.find(
                "span",
                {"class": "media_end_head_info_datestamp_time _ARTICLE_DATE_TIME"},
            )
            date_time = date_time_tag.get("data-date-time") if date_time_tag else None

            # 뉴스 기사 본문 추출
            article_content_tag = soup.find("article", {"id": "dic_area"})
            if article_content_tag:
                exclude_part = article_content_tag.find("em", {"class": "img_desc"})
                if exclude_part:
                    exclude_part.extract()
                article_content = article_content_tag.get_text().strip()
            else:
                article_content = None

            return article_content, date_time, response.status_code

    except httpx.RequestError as e:
        print(f"에러: {e}")
        return None, None, e.response.status_code if e.response else 500


# content 업데이트
async def update_articles_in_db(duration: float) -> None:
    document_list = await fetch_uncrawled_documents("uncrawled")

    # 리스트를 DataFrame으로 변환
    df = pd.DataFrame(document_list)
    print("find uncrwaled documents : ", len(df))
    updated_count = 0

    for index, row in tqdm(
        df.iterrows(), total=df.shape[0], desc="Content Crawling by URL"
    ):
        url = row["url"]
        content, date_time, status = await fetch_article_content(url)

        current_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        update_data = {
            "date_time": date_time,
            "modified_at": current_time_str,
            "status": str(status),
        }

        if status == 200:
            update_data["content"] = content
            update_data["crawled"] = "crawled"
            updated_count += 1
        else:
            update_data["crawled"] = "error"

        await update_document_in_db(row["_id"], update_data)
        await asyncio.sleep(duration)
    print("updated contents documents : ", updated_count)


# status가 302인 documents 업데이트 - 수동(api)
async def update_302_error_articles_in_db() -> None:
    document_list = await fetch_error_documents("302")

    # 리스트를 DataFrame으로 변환
    df = pd.DataFrame(document_list)
    print("find 302 error documents : ", len(df))
    updated_count = 0

    for index, row in tqdm(
        df.iterrows(), total=df.shape[0], desc="302 Error Content Crawling by URL"
    ):
        url = row["url"]
        location = await fetch_article_content(url)

        current_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        update_data = {
            "url": location,
            "modified_at": current_time_str,
            "cralwed": "uncrawled",
            "status": "",
        }

        await update_document_in_db(row["_id"], update_data)
        await asyncio.sleep(duration)
    print("updated 302 error documents : ", updated_count)
