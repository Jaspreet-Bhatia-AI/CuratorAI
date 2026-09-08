from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from services import generate_roadmap_json, search_youtube

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

@app.websocket("/api/ws/download")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Expecting JSON like: {"url": "...", "format": "Audio/Video"}
            import json
            req = json.loads(data)
            url = req.get("url")
            
            # Simulate streaming download progress for now
            # Later we integrate the real yt-dlp progress hook
            for i in range(1, 101, 10):
                await websocket.send_json({"url": url, "progress": i, "status": "downloading"})
                await asyncio.sleep(0.5)
                
            await websocket.send_json({"url": url, "progress": 100, "status": "completed"})
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WS error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
