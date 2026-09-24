import os
import re

filepath = '/home/jass/education/projects/curator-ai/backend/main.py'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Update get_current_user
content = re.sub(
    r'def get_current_user\(credentials: HTTPAuthorizationCredentials = Depends\(security\)\):.*?(?=\n\n# Configure Rate Limiter)',
    r'''def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Authentication service not configured")
    token = credentials.credentials
    try:
        user_res = supabase_client.auth.get_user(token)
        if not user_res or not user_res.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_res.user
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")''',
    content,
    flags=re.DOTALL
)

# 2. Update Input Validation Models
content = re.sub(
    r'class RoadmapRequest\(BaseModel\):.*?class SearchRequest\(BaseModel\):.*?original_query: Optional\[str\] = None',
    r'''from pydantic import Field

class RoadmapRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    user_email: Optional[str] = Field(None, max_length=100)

class SearchRequest(BaseModel):
    search_query: str = Field(..., min_length=1, max_length=200)
    type: str = Field("education", max_length=20)
    original_query: Optional[str] = Field(None, max_length=200)''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'class BatchPrepareRequest\(BaseModel\):\n    urls: list\[str\]\n    format: str = "audio"',
    r'''class BatchPrepareRequest(BaseModel):
    urls: list[str] = Field(..., max_items=20)
    format: str = Field("audio", max_length=20)''',
    content
)

content = re.sub(
    r'class DownloadRequest\(BaseModel\):\n    url: str\n    format: str = "audio"',
    r'''class DownloadRequest(BaseModel):
    url: str = Field(..., max_length=500)
    format: str = Field("audio", max_length=20)''',
    content
)

# 3. Update endpoints
content = re.sub(
    r'@app.post\("/api/generate-roadmap"\)\n@limiter\.limit\("5/minute"\)\nasync def generate_roadmap\(request: Request, req: RoadmapRequest\):.*?(?=return {"success": True, "data": data})',
    r'''@app.post("/api/generate-roadmap")
@limiter.limit("5/minute")
async def generate_roadmap(request: Request, req: RoadmapRequest, user=Depends(get_current_user)):
    provider = request.headers.get("X-AI-Provider", "groq")
    api_key = request.headers.get("X-AI-Key", "")
    try:
        data = generate_roadmap_json(req.query, provider, api_key)
        import db
        user_email = user.email if hasattr(user, 'email') else user.get("email")
        db.save_user_history(user_email, req.query, data)
        ''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'raise HTTPException\(status_code=500, detail=str\(e\)\)',
    r'raise HTTPException(status_code=500, detail="Internal server error")',
    content
)

content = re.sub(
    r'@app.get\("/api/history"\)\nasync def get_history\(email: str = None\):.*?(?=@app.post\("/api/search"\))',
    r'''@app.get("/api/history")
@limiter.limit("10/minute")
async def get_history(request: Request, user=Depends(get_current_user)):
    user_email = user.email if hasattr(user, 'email') else user.get("email")
    if not user_email:
        return {"success": True, "data": []}
    import db
    data = db.get_user_history(user_email)
    return {"success": True, "data": data}

''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'@app.post\("/api/search"\)\n@limiter\.limit\("30/minute"\)\nasync def search_video\(request: Request, req: SearchRequest\):',
    r'''@app.post("/api/search")
@limiter.limit("30/minute")
async def search_video(request: Request, req: SearchRequest, user=Depends(get_current_user)):''',
    content
)

content = re.sub(
    r'@app.post\("/api/batch-prepare"\)\n@limiter\.limit\("5/minute"\)\nasync def batch_prepare\(request: Request, req: BatchPrepareRequest\):',
    r'''@app.post("/api/batch-prepare")
@limiter.limit("5/minute")
async def batch_prepare(request: Request, req: BatchPrepareRequest, user=Depends(get_current_user)):''',
    content
)

content = re.sub(
    r'@app.get\("/api/batch-download"\)\n@limiter\.limit\("5/minute"\)\nasync def batch_download\(request: Request, background_tasks: BackgroundTasks, batch_id: str, task_id: str = None\):',
    r'''@app.get("/api/batch-download")
@limiter.limit("5/minute")
async def batch_download(request: Request, background_tasks: BackgroundTasks, batch_id: str, task_id: str = None, user=Depends(get_current_user)):''',
    content
)

content = re.sub(
    r'@app.get\("/api/progress"\)\n@limiter\.limit\("60/minute"\)\nasync def get_progress\(request: Request, task_id: str\):',
    r'''@app.get("/api/progress")
@limiter.limit("60/minute")
async def get_progress(request: Request, task_id: str, user=Depends(get_current_user)):''',
    content
)

content = re.sub(
    r'@app.get\("/api/download"\)\n@limiter\.limit\("50/minute"\)\nasync def download_endpoint\(request: Request, url: str, background_tasks: BackgroundTasks, format: str = "video_high", task_id: str = None\):',
    r'''@app.get("/api/download")
@limiter.limit("50/minute")
async def download_endpoint(request: Request, url: str, background_tasks: BackgroundTasks, format: str = "video_high", task_id: str = None, user=Depends(get_current_user)):''',
    content
)

content = re.sub(
    r'@app.get\("/api/local-files"\)\n@limiter\.limit\("60/minute"\)\nasync def list_local_files\(request: Request\):',
    r'''@app.get("/api/local-files")
@limiter.limit("60/minute")
async def list_local_files(request: Request, user=Depends(get_current_user)):''',
    content
)

content = re.sub(
    r'@app.get\("/api/stream/\{filename:path\}"\)\n@limiter\.limit\("120/minute"\)\nasync def stream_file\(request: Request, filename: str\):\n    download_dir = os.path.join\(os.getcwd\(\), "temp_downloads"\)\n    filepath = os.path.join\(download_dir, filename\)',
    r'''@app.get("/api/stream/{filename:path}")
@limiter.limit("120/minute")
async def stream_file(request: Request, filename: str, user=Depends(get_current_user)):
    if ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    download_dir = os.path.abspath(os.path.join(os.getcwd(), "temp_downloads"))
    filepath = os.path.abspath(os.path.join(download_dir, filename))
    if not filepath.startswith(download_dir):
        raise HTTPException(status_code=403, detail="Access denied")''',
    content
)

content = re.sub(
    r'@app.get\("/api/cloud-media"\)\nasync def list_cloud_media\(user=Depends\(get_current_user\)\):',
    r'''@app.get("/api/cloud-media")
@limiter.limit("30/minute")
async def list_cloud_media(request: Request, user=Depends(get_current_user)):''',
    content
)

content = re.sub(
    r'@app.get\("/api/cloud-media/stream/\{media_type\}/\{filename\}"\)\nasync def stream_cloud_media\(media_type: str, filename: str\):\n    """Streams the file from the Laptop Server directly to the user\'s offline app"""\n    if media_type not in \["audio", "video"\]:\n        raise HTTPException\(status_code=400, detail="Invalid media type"\)\n        \n    file_path = os.path.join\(CLOUD_LIBRARY_DIR, media_type, filename\)',
    r'''@app.get("/api/cloud-media/stream/{media_type}/{filename}")
@limiter.limit("120/minute")
async def stream_cloud_media(request: Request, media_type: str, filename: str, user=Depends(get_current_user)):
    """Streams the file from the Laptop Server directly to the user's offline app"""
    if media_type not in ["audio", "video"]:
        raise HTTPException(status_code=400, detail="Invalid media type")
        
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
        
    file_path = os.path.join(CLOUD_LIBRARY_DIR, media_type, filename)''',
    content
)

with open(filepath, 'w') as f:
    f.write(content)
