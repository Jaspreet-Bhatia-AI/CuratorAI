from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import os
from services import generate_roadmap_json, search_youtube, download_video

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

@app.get("/api/download")
async def download_endpoint(url: str, background_tasks: BackgroundTasks):
    download_dir = os.path.join(os.getcwd(), "temp_downloads")
    filepath = download_video(url, download_dir)
    
    if not filepath or not os.path.exists(filepath):
        raise HTTPException(status_code=500, detail="Failed to download video from YouTube")
    
    # Send the file to the user's browser, then delete it from the server to save space
    filename = os.path.basename(filepath)
    background_tasks.add_task(remove_file, filepath)
    
    return FileResponse(
        path=filepath,
        filename=filename,
        media_type="video/mp4",
        headers={"Content-Disposition": f"attachment; filename=\"{filename}\""}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
