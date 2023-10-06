from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from fastapi.templating import Jinja2Templates
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.service.crawler.url_collector import remove_and_insert_urls_into_db
from app.service.crawler.url_collector import scheduling_url_collector
from app.service.crawler.content_collector import update_articles_in_db
from app.service.crawler.content_collector import update_302_error_articles_in_db
import asyncio
import logging

router = APIRouter()

# Jinja2 템플릿 설정
templates = Jinja2Templates(directory="static/html")

# APScheduler 설정
scheduler = AsyncIOScheduler()
scheduler.start()

# 동적 스케줄링 설정
lock_collect_urls = asyncio.Lock()
lock_collect_contents = asyncio.Lock()
lock_302_error_update = asyncio.Lock()

# 로깅 설정 초기화
logging.basicConfig()

# 'apscheduler.scheduler' 로거를 가져와서 로깅 레벨을 ERROR로 설정
scheduler_logger = logging.getLogger("apscheduler.scheduler")
scheduler_logger.setLevel(logging.ERROR)


# 커스텀 로그 필터 생성
class IgnoreJobExecutionSkipFilter(logging.Filter):
    def filter(self, record):
        return "skipped: maximum number of running instances reached" not in record.msg


# 필터 인스턴스 생성
my_filter = IgnoreJobExecutionSkipFilter()

# 로거에 필터 추가
scheduler_logger.addFilter(my_filter)


# 커스텀 로그 필터 생성
class IgnoreJobExecutionSkipFilter(logging.Filter):
    def filter(self, record):
        return "skipped: maximum number of running instances reached" not in record.msg


# 필터 인스턴스 생성
my_filter = IgnoreJobExecutionSkipFilter()

# 로거에 필터 추가
scheduler_logger.addFilter(my_filter)


async def schedule_jobs(
    start_page: int,
    threshold: int,
    duration: float,
    minutes: float,
    hours: int,
):
    scheduler.add_job(
        scheduling_url_collector,
        "interval",
        (start_page, threshold, duration),
        minutes=minutes,
        id="job_collect_urls",
        replace_existing=True,
        max_instances=1,
    )
    print("url 크롤링 스케줄러 등록완료!")

    scheduler.add_job(
        update_articles_in_db,
        "interval",
        (duration,),
        minutes=minutes,
        id="job_collect_contents",
        replace_existing=True,
        max_instances=1,
    )
    print("content 크롤링 스케줄러 등록완료!")

    scheduler.add_job(
        update_302_error_articles_in_db,
        "interval",
        hours=hours,
        id="job_302_error_update",
        replace_existing=True,
        max_instances=1,
    )
    print("302 에러 업데이트 스케줄러 등록 완료!")


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
    hours: int = 24,
):
    """***주어진 파라미터를 기반으로 URL 및 Content 크롤링 작업을 스케줄링합니다***.

    - **start_page**: URL 수집을 시작할 페이지 번호
    - **threshold**: 페이지 임계값 (10000을 입력하면 그날 최대 페이지까지 얻을 수 있음)
    - **duration**: 크롤링 딜레이 시간 (분 단위)
    - **minutes**: scheduler time interval. 기본 값 : 1분
    - **hours**: scheduler time interval. 기본 값(302 업데이트) : 24시간

    APScheduler를 사용하여 1분마다 실행됩니다. 백그라운드에서 수행됩니다.
    """
    try:
        await schedule_jobs(start_page, threshold, duration, minutes, hours)
        return {"status": "Tasks scheduled to run every minute."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/v1/collection/scheduling/stop-all", tags=["scheduling"])
async def stop_all_scheduled_collection():
    """***실행중인 모든 크롤링 작업스케줄링을 중단합니다.***"""

    try:
        # job_collect_urls 작업이 존재하면 중지
        if scheduler.get_job("job_collect_urls"):
            scheduler.remove_job("job_collect_urls")
            print("urls 크롤링을 스케줄러에서 제거합니다.")

        # job_collect_contents 작업이 존재하면 중지
        if scheduler.get_job("job_collect_contents"):
            scheduler.remove_job("job_collect_contents")
            print("contents 크롤링을 스케줄러에서 제거합니다.")

        # job_302_error_update 작업이 존재하면 중지
        if scheduler.get_job("job_302_error_update"):
            scheduler.remove_job("job_302_error_update")
            print("302-error update 기능을 스케줄러에서 제거합니다.")

        return {"status": "Collection all tasks stopped."}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to stop all collecting.")


@router.get("/api/v1/collection/scheduling/stop/urls", tags=["scheduling"])
async def stop_urls_scheduled_collection():
    """***실행중인 urls 크롤링 작업스케줄링을 중단합니다.***"""

    try:
        # job_collect_urls 작업이 존재하면 중지
        if scheduler.get_job("job_collect_urls"):
            scheduler.remove_job("job_collect_urls")
            print("urls 크롤링을 스케줄러에서 제거합니다.")

        return {"status": "Collection urls tasks stopped."}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to stop urls collecting.")


@router.get("/api/v1/collection/scheduling/stop/contents", tags=["scheduling"])
async def stop_contents_scheduled_collection():
    """***실행중인 contents 크롤링 작업스케줄링을 중단합니다.***"""

    try:
        # job_collect_contents 작업이 존재하면 중지
        if scheduler.get_job("job_collect_contents"):
            scheduler.remove_job("job_collect_contents")
            print("contents 크롤링을 스케줄러에서 제거합니다.")

        return {"status": "Collection contents tasks stopped."}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Failed to stop contents collecting."
        )


@router.get("/api/v1/collection/scheduling/stop/302-error", tags=["scheduling"])
async def stop_302_error_scheduled_collection():
    """***실행중인 302-error 업데이트 작업스케줄링을 중단합니다.***"""

    try:
        # job_302_error_update 작업이 존재하면 중지
        if scheduler.get_job("job_302_error_update"):
            scheduler.remove_job("job_302_error_update")
            print("302-error update 기능을 스케줄러에서 제거합니다.")

        return {"status": "update 302-error tasks stopped."}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="Failed to stop 302-error updating."
        )


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


@router.put("/api/v1/collection/update/302-error/", tags=["collection"])
async def start_302_error_content_collection(background_tasks: BackgroundTasks):
    """***DB에 존재하는 status 필드 값이 "302"인 document의 url, cralwed, status를 update하는 API입니다.***
    ***302에러는 url이 존재하지만 콘텐츠의 이동이 있어서 처음 크롤링 당시 에러가 났던 url이기 때문입니다.***
    - 필드 값 없음.

    백그라운드에서 수행됩니다.
    """
    try:
        background_tasks.add_task(update_302_error_articles_in_db)
        return {"status": "302 Error Contents collection started."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
