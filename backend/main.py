import os
import re
import asyncio
from fastapi import FastAPI, BackgroundTasks, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from services import generate_roadmap_json, search_youtube, download_video, DOWNLOAD_PROGRESS

# Configure Rate Limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="AI YouTube Downloader API")
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"success": False, "detail": "Rate limit exceeded. Please slow down and try again."}
    )

def is_valid_youtube_url(url: str) -> bool:
    youtube_regex = (
        r'(https?://)?(www\.)?'
        r'(youtube|youtu|youtube-nocookie)\.(com|be)/'
        r'(watch\?v=|embed/|v/|.+\?v=|shorts/)?([^&=%\?]{11})'
    )
    return bool(re.match(youtube_regex, url))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RoadmapRequest(BaseModel):
    query: str

from typing import Optional
class SearchRequest(BaseModel):
    search_query: str
    type: str = "education"
    original_query: Optional[str] = None

@app.post("/api/generate-roadmap")
@limiter.limit("5/minute")
async def generate_roadmap(request: Request, req: RoadmapRequest):
    try:
        data = generate_roadmap_json(req.query)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search")
@limiter.limit("30/minute")
async def search_video(request: Request, req: SearchRequest):
    result = search_youtube(req.search_query, req.type, req.original_query)
    if result:
        return {"success": True, "data": result}
    raise HTTPException(status_code=404, detail="Video not found")

def remove_file(path: str):
    try:
        os.remove(path)
    except Exception as e:
        print(f"Error removing temp file {path}: {e}")


@app.get("/api/progress")
@limiter.limit("60/minute")
async def get_progress(request: Request, task_id: str):
    return DOWNLOAD_PROGRESS.get(task_id, {"status": "waiting", "percent": "0%"})

@app.get("/api/download")
@limiter.limit("15/minute")
async def download_endpoint(request: Request, url: str, background_tasks: BackgroundTasks, format: str = "video_high", task_id: str = None):
    if not is_valid_youtube_url(url):
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
        
    download_dir = os.path.join(os.getcwd(), "temp_downloads")
    filepath = download_video(url, download_dir, format, task_id)
    
    if not filepath or not os.path.exists(filepath):
        raise HTTPException(status_code=500, detail="Failed to download video from YouTube")
    
    filename = os.path.basename(filepath)
    background_tasks.add_task(remove_file, filepath)
    
    media_type = "audio/mpeg" if format == "audio" else "video/mp4"
    
    return FileResponse(
        path=filepath,
        filename=filename,
        media_type=media_type,
        # Let FastAPI handle headers for unicode filenames
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
