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

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase_client = None

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not supabase_client:
        return {"id": "dummy_user", "email": "dev@local"} # Fallback if env vars missing
    token = credentials.credentials
    try:
        user_res = supabase_client.auth.get_user(token)
        if not user_res or not user_res.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_res.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


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
    user_email: str = None

from typing import Optional
class SearchRequest(BaseModel):
    search_query: str
    type: str = "education"
    original_query: Optional[str] = None

@app.post("/api/generate-roadmap")
@limiter.limit("5/minute")
async def generate_roadmap(request: Request, req: RoadmapRequest):
    provider = request.headers.get("X-AI-Provider", "groq")
    api_key = request.headers.get("X-AI-Key", "")
    try:
        data = generate_roadmap_json(req.query, provider, api_key)
        # Save to DB history
        import db
        db.save_user_history(req.user_email, req.query, data)
        return {"success": True, "data": data}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/api/history")
async def get_history(email: str = None):
    if not email:
        return {"success": True, "data": []}
    import db
    data = db.get_user_history(email)
    return {"success": True, "data": data}

@app.post("/api/search")
@limiter.limit("30/minute")
async def search_video(request: Request, req: SearchRequest):
    result = await asyncio.to_thread(search_youtube, req.search_query, req.type, req.original_query)
    if result:
        return {"success": True, "data": result}
    raise HTTPException(status_code=404, detail="Video not found")

def remove_file(path: str):
    try:
        os.remove(path)
    except Exception as e:
        print(f"Error removing temp file {path}: {e}")



import uuid
import zipfile
import time
from concurrent.futures import ThreadPoolExecutor

batch_jobs = {}

class BatchPrepareRequest(BaseModel):
    urls: list[str]
    format: str = "audio"

def cleanup_batch_files(paths: list[str]):
    time.sleep(10) # buffer to ensure FileResponse finishes streaming
    for p in paths:
        try: os.remove(p)
        except: pass

@app.post("/api/batch-prepare")
@limiter.limit("5/minute")
async def batch_prepare(request: Request, req: BatchPrepareRequest):
    batch_id = uuid.uuid4().hex
    batch_jobs[batch_id] = {"urls": req.urls, "format": req.format}
    return {"success": True, "batch_id": batch_id}

@app.get("/api/batch-download")
@limiter.limit("5/minute")
async def batch_download(request: Request, background_tasks: BackgroundTasks, batch_id: str, task_id: str = None):
    if batch_id not in batch_jobs:
        raise HTTPException(status_code=404, detail="Batch job not found")
        
    job = batch_jobs[batch_id]
    urls = job["urls"]
    format_type = job["format"]
    
    download_dir = os.path.join(os.getcwd(), "temp_downloads")
    os.makedirs(download_dir, exist_ok=True)
    
    downloaded_files = []
    
    if task_id:
        DOWNLOAD_PROGRESS[task_id] = {"status": "downloading", "percent": f"Fetching {len(urls)} items..."}
        
    def download_worker(url):
        return download_video(url, download_dir, format_type, None)

    # Download in parallel
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = executor.map(download_worker, urls)
        for res in results:
            if res and os.path.exists(res):
                downloaded_files.append(res)
                
    if not downloaded_files:
        raise HTTPException(status_code=500, detail="Failed to download videos")
        
    if task_id:
        DOWNLOAD_PROGRESS[task_id] = {"status": "processing", "percent": "Zipping files..."}
        
    zip_filename = f"Curator_Collection_{uuid.uuid4().hex[:6]}.zip"
    zip_filepath = os.path.join(download_dir, zip_filename)
    
    with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in downloaded_files:
            zipf.write(file, os.path.basename(file))
            
    background_tasks.add_task(cleanup_batch_files, downloaded_files + [zip_filepath])
    
    if task_id:
        DOWNLOAD_PROGRESS[task_id] = {"status": "processing", "percent": "100%"}
        
    return FileResponse(
        path=zip_filepath,
        filename=zip_filename,
        media_type="application/zip"
    )

@app.get("/api/progress")
@limiter.limit("60/minute")
async def get_progress(request: Request, task_id: str):
    return DOWNLOAD_PROGRESS.get(task_id, {"status": "waiting", "percent": "0%"})


class DownloadRequest(BaseModel):
    url: str
    format: str = "audio"

from compressor import compress_media_background

@app.post("/api/download-audio")
@limiter.limit("50/minute")
async def download_audio_endpoint(request: Request, req: DownloadRequest, background_tasks: BackgroundTasks, user=Depends(get_current_user)):
    if not is_valid_youtube_url(req.url):
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
        
    format_mapping = {
        "mp3": "audio",
        "audio": "audio",
        "720p": "video_fast",  # Fixed: Now maps to 720p correctly
        "1080p": "video_high"
    }
    mapped_format = format_mapping.get(req.format, req.format)
    
    # Save directly to permanent Cloud Library instead of temp_downloads
    sub_folder = "audio" if mapped_format == "audio" else "video"
    download_dir = os.path.join(CLOUD_LIBRARY_DIR, sub_folder)
    os.makedirs(download_dir, exist_ok=True)
    
    filepath = download_video(req.url, download_dir, mapped_format, None)
    
    if not filepath or not os.path.exists(filepath):
        raise HTTPException(status_code=500, detail="Failed to download video from YouTube")
    
    filename = os.path.basename(filepath)
    
    # INSTEAD of deleting the file, we keep it and compress it!
    background_tasks.add_task(compress_media_background, filepath, mapped_format)
    
    media_type = "audio/mpeg" if mapped_format == "audio" else "video/mp4"
    
    return FileResponse(
        path=filepath,
        filename=filename,
        media_type=media_type
    )


@app.get("/api/download")
@limiter.limit("50/minute")
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


@app.get("/api/local-files")
@limiter.limit("60/minute")
async def list_local_files(request: Request):
    download_dir = os.path.join(os.getcwd(), "temp_downloads")
    if not os.path.exists(download_dir):
        return {"success": True, "files": []}
    
    files = []
    for f in os.listdir(download_dir):
        path = os.path.join(download_dir, f)
        if os.path.isfile(path):
            size = os.path.getsize(path)
            size_mb = f"{size / (1024 * 1024):.2f} MB"
            is_audio = f.endswith(".mp3") or f.endswith(".wav") or f.endswith(".m4a")
            files.append({
                "filename": f,
                "size": size_mb,
                "size_bytes": size,
                "format": "MP3 Audio" if is_audio else "Video",
                "category": "Music" if is_audio else "Learning"
            })
    return {"success": True, "files": files}

@app.get("/api/stream/{filename:path}")
@limiter.limit("120/minute")
async def stream_file(request: Request, filename: str):
    download_dir = os.path.join(os.getcwd(), "temp_downloads")
    filepath = os.path.join(download_dir, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    
    # FileResponse automatically supports Range requests for media streaming!
    return FileResponse(filepath)

if __name__ == "__main__":

    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

# ==========================================
# Phase 2: Cloud Library (Offline Ecosystem)
# ==========================================

CLOUD_LIBRARY_DIR = os.path.join(os.path.dirname(__file__), "cloud_library")

@app.get("/api/cloud-media")
async def list_cloud_media(user=Depends(get_current_user)):
    """Lists all media permanently stored on the Laptop Server"""
    audio_dir = os.path.join(CLOUD_LIBRARY_DIR, "audio")
    video_dir = os.path.join(CLOUD_LIBRARY_DIR, "video")
    
    media = []
    
    if os.path.exists(audio_dir):
        for f in os.listdir(audio_dir):
            if not f.startswith('.'):
                media.append({
                    "id": f"audio_{f}",
                    "title": f,
                    "type": "audio",
                    "filename": f,
                    "url": f"/api/cloud-media/stream/audio/{f}"
                })
                
    if os.path.exists(video_dir):
        for f in os.listdir(video_dir):
            if not f.startswith('.'):
                media.append({
                    "id": f"video_{f}",
                    "title": f,
                    "type": "video",
                    "filename": f,
                    "url": f"/api/cloud-media/stream/video/{f}"
                })
                
    return {"success": True, "data": media}

@app.get("/api/cloud-media/stream/{media_type}/{filename}")
async def stream_cloud_media(media_type: str, filename: str):
    """Streams the file from the Laptop Server directly to the user's offline app"""
    if media_type not in ["audio", "video"]:
        raise HTTPException(status_code=400, detail="Invalid media type")
        
    file_path = os.path.join(CLOUD_LIBRARY_DIR, media_type, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on server")
        
    return FileResponse(file_path)

