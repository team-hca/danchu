from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from fastapi.templating import Jinja2Templates
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.service.crawler.url_collector import remove_and_insert_urls_into_db
from app.service.crawler.url_collector import scheduling_url_collector
from app.service.crawler.content_collector import update_articles_in_db
from app.service.crawler.content_collector import scheduling_content_collector
from datetime import datetime

router = APIRouter()

# Jinja2 템플릿 설정
templates = Jinja2Templates(directory="static/html")

# APScheduler 설정
scheduler = AsyncIOScheduler()
scheduler.start()


async def schedule_jobs(
    start_page: int,
    threshold: int,
    duration: float,
    minutes: float,
):
    print("url 크롤링 스케줄러를 등록합니다.")
    scheduler.add_job(
        scheduling_url_collector,
        "interval",
        (start_page, threshold, duration),
        minutes=minutes,
        id="job_collect_urls",
        replace_existing=True,
    )
    print("url 크롤링 스케줄러 등록완료!")
    print("content 크롤링 스케줄러를 등록합니다.")
    scheduler.add_job(
        scheduling_content_collector,
        "interval",
        (duration,),
        minutes=minutes,
        id="job_collect_contents",
        replace_existing=True,
    )
    print("content 크롤링 스케줄러 등록완료!")


@router.get("/", tags=["views"])
async def render_home_page(request: Request):
    """인덱스 페이지로 이동합니다."""

    return templates.TemplateResponse("index.html", {"request": request})


@router.post("/api/v1/collection/scheduling/start", tags=["scheduling"])
async def schedule_collection_tasks(
    start_page: int = 1,
    threshold: int = 10,
    duration: float = 0.1,
    minutes: float = 1.0,
):
    """***주어진 파라미터를 기반으로 URL 및 Content 크롤링 작업을 스케줄링합니다***.

    - **start_page**: URL 수집을 시작할 페이지 번호
    - **threshold**: 페이지 임계값 (10000을 입력하면 그날 최대 페이지까지 얻을 수 있음)
    - **duration**: 크롤링 딜레이 시간 (분 단위)
    - **minutes**: scheduler time interval. 기본 값 : 1분

    APScheduler를 사용하여 1분마다 실행됩니다. 백그라운드에서 수행됩니다.
    """
    try:
        await schedule_jobs(start_page, threshold, duration, minutes)
        return {"status": "Tasks scheduled to run every minute."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/v1/collection/scheduling/stop", tags=["scheduling"])
async def stop_scheduled_collection():
    """***실행중인 크롤링 작업스케줄링을 중단합니다.***"""

    try:
        # job_collect_urls 작업이 존재하면 중지
        if scheduler.get_job("job_collect_urls"):
            scheduler.remove_job("job_collect_urls")

        # job_collect_contents 작업이 존재하면 중지
        if scheduler.get_job("job_collect_contents"):
            scheduler.remove_job("job_collect_contents")
        return {"status": "Collection tasks stopped."}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to stop collecting.")


@router.post("/api/v1/collection/urls/", tags=["collection"])
async def start_url_collection(
    background_tasks: BackgroundTasks,
    start_date: int = 20230901,
    end_date: int = 20230901,
    start_page: int = 1,
    threshold: int = 10,
    duration: float = 0.5,
):
    """***주어진 파라미터를 기반으로 URL 크롤링 작업을 수행합니다***.

    - **start_date**: URL 수집을 시작할 날짜 (예: 20230901)
    - **end_date**: URL 수집을 종료할 날짜 (예: 20230901)
    - **start_page**: URL 수집을 시작할 페이지 번호
    - **threshold**: 페이지 임계값 (10000을 입력하면 그날 최대 페이지까지 얻을 수 있음)
    - **duration**: 각 작업 사이의 대기 시간 (분 단위)

    백그라운드에서 수행됩니다.
    """

    try:
        background_tasks.add_task(
            remove_and_insert_urls_into_db,
            start_page,
            start_date,
            end_date,
            threshold,
            duration,
        )
        return {"status": "URLs collection started."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/v1/collection/contents/", tags=["collection"])
async def start_content_collection(
    background_tasks: BackgroundTasks, duration: float = 0.1
):
    """***DB에 존재하는 crawled 필드 값이 "uncrawled"인 document의 Contents를 update하는 API입니다.***

    - **duration**: 각 작업 사이의 대기 시간 (분 단위)

    백그라운드에서 수행됩니다.
    """
    try:
        background_tasks.add_task(update_articles_in_db, duration)
        return {"status": "Contents collection started."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
