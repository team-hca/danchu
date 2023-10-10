from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.v1.endpoints import router as scraper_router
from app.api.v1.endpoints import schedule_jobs

app = FastAPI(
    title="Crawling",
    description="### Hi, My name is SeungGyuuuu~~~~💗🐣🐥",
    version="1.0.0",
)


@app.on_event("startup")
async def startup_event():
    await schedule_jobs(start_page=1, threshold=10, duration=0.1, minutes=1, hours=24)


# static 폴더 설정 (예: CSS, JS, 이미지 등)
app.mount("/static", StaticFiles(directory="static"), name="static")

# 라우터 추가
app.include_router(scraper_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
