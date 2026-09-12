from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import os
from services import generate_roadmap_json, search_youtube, download_video, DOWNLOAD_PROGRESS

app = FastAPI(title="AI YouTube Downloader API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RoadmapRequest(BaseModel):
    query: str

class SearchRequest(BaseModel):
    search_query: str

@app.post("/api/generate-roadmap")
async def generate_roadmap(req: RoadmapRequest):
    try:
        data = generate_roadmap_json(req.query)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search")
async def search_video(req: SearchRequest):
    result = search_youtube(req.search_query)
    if result:
        return {"success": True, "data": result}
    raise HTTPException(status_code=404, detail="Video not found")

def remove_file(path: str):
    try:
        os.remove(path)
    except Exception as e:
        print(f"Error removing temp file {path}: {e}")


@app.get("/api/progress")
async def get_progress(task_id: str):
    return DOWNLOAD_PROGRESS.get(task_id, {"status": "waiting", "percent": "0%"})

@app.get("/api/download")
async def download_endpoint(url: str, background_tasks: BackgroundTasks, format: str = "video_high", task_id: str = None):
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
