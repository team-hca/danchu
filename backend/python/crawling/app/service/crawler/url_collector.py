# url_collector.property

from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import pandas as pd
import asyncio
from datetime import datetime
from tqdm import tqdm
import importlib
import httpx
from app.db.database import (
    fetch_all_documents_from_db,
    insert_dataframe_into_db,
)
from app.core import config


# 크롤링 방지 우회 설정 초기화
ua = UserAgent()
HEADERS = {"User-Agent": ua.random}

# pandas 출력 옵션 설정
pd.set_option("display.max_colwidth", None)


async def fetch_html(url: str) -> str:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=HEADERS)
            response.raise_for_status()
            return response.text
    except httpx.RequestError as e:
        print(f"에러: {e}")
        return ""


# 특정 날짜의 마지막 페이지 번호를 반환
async def get_last_page_for_date(date: str, page: int) -> int:
    url = f"https://news.naver.com/main/list.naver?mode=LSD&mid=sec&sid1=001&date={date}&page={page}"
    html = await fetch_html(url)

    soup = BeautifulSoup(html, "html.parser")
    pagination_div = soup.find("div", {"class": "paging"})

    if pagination_div:
        current_page = pagination_div.find("strong")
        if current_page:
            return int(current_page.text)
    return -1


# 특정 날짜와 페이지에서 기사 제목과 URL을 추출
async def extract_url_from_page(date: str, page: int) -> pd.DataFrame:
    url = f"https://news.naver.com/main/list.naver?mode=LSD&mid=sec&sid1=001&date={date}&page={page}"
    html = await fetch_html(url)

    soup = BeautifulSoup(html, "html.parser")
    news_list_div = soup.find("div", {"class": "list_body newsflash_body"})
    articles = {"title": [], "url": []}

    if news_list_div:
        links = news_list_div.find_all("a", {"class": "nclicks(fls.list)"})

        for link in links:
            parent_dt = link.find_parent("dt")
            if parent_dt and "photo" in parent_dt.get("class", []):
                continue
            articles["title"].append(link.text.strip())
            articles["url"].append(link["href"].strip())

    return pd.DataFrame(articles)


# 지정된 날짜 범위의 모든 기사 제목과 URL을 수집
async def collect_urls(
    start_page: int, start_date: int, end_date: int, threshold: int, duration: float
) -> pd.DataFrame:
    all_dfs = []
    total_urls = 0

    for date in tqdm(range(start_date, end_date + 1), desc="날짜별 url 수집"):
        last_page = await get_last_page_for_date(str(date), threshold)

        for page in tqdm(range(start_page, last_page + 1), desc="페이지별 url 수집"):
            df = await extract_url_from_page(str(date), page)

            df["date"] = str(date)
            df["date_time"] = ""
            df["content"] = ""
            current_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            df["created_at"] = current_time_str
            df["modified_at"] = current_time_str
            df["crawled"] = "uncrawled"
            df["status"] = ""

            all_dfs.append(df)
            total_urls += len(df)
            await asyncio.sleep(duration)

    print("collection urls : ", total_urls)
    return pd.concat(all_dfs, ignore_index=True).drop_duplicates(subset=["url"])


# 수집한 url을 DB에 중복되는 요소를 제거하는 하고 DB에 삽입하는 함수 - 특정 날짜
async def remove_and_insert_urls_into_db(
    start_page: int, start_date: int, end_date: int, threshold: int, duration: float
):
    importlib.reload(config)
    new_df = await collect_urls(start_page, start_date, end_date, threshold, duration)
    count = len(new_df)
    old_df = await fetch_all_documents_from_db()
    if not old_df.empty:
        new_df = new_df[~new_df["url"].isin(old_df["url"])]
    count -= len(new_df)
    print("remove duplication urls : ", count)
    print("inserted urls : ", len(new_df))
    await insert_dataframe_into_db(new_df)


# 수집한 url을 DB에 중복되는 요소를 제거하는 하고 DB에 삽입하는 함수 - 스케줄링
async def scheduling_url_collector(start_page: int, threshold: int, duration: float):
    importlib.reload(config)
    new_df = await collect_urls(
        start_page, config.CURRENT_DATE, config.CURRENT_DATE, threshold, duration
    )
    count = len(new_df)
    old_df = await fetch_all_documents_from_db()
    if not old_df.empty:
        new_df = new_df[~new_df["url"].isin(old_df["url"])]
    count -= len(new_df)
    print("remove duplication urls : ", count)
    print("inserted urls : ", len(new_df))
    await insert_dataframe_into_db(new_df)
