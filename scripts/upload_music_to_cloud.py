import os
import re
import uuid
from supabase import create_client, Client
from urllib.parse import quote
from mutagen.mp3 import MP3

url = "https://zcbulmwddycalcxuaykz.supabase.co"
key = "sb_publishable_YlbR6VdBm0hAH7N1oHowTg_eGwDa8F7"
supabase: Client = create_client(url, key)

bucket_name = "cloud-library"
music_dir = "/home/jass/Music"
files = [f for f in os.listdir(music_dir) if f.endswith('.mp3')]

# A simple regex to strip trailing _XXXXXX if it exists
def get_base_name(filename):
    return re.sub(r'_[a-f0-9]{6}\.mp3$', '', filename).strip('.mp3')

# Format duration from seconds to m:ss
def format_duration(seconds):
    m, s = divmod(int(seconds), 60)
    return f"{m}:{s:02d}"

unique_bases = {}
duplicates_to_delete = []

for f in files:
    basename = get_base_name(f)
    if basename in unique_bases:
        duplicates_to_delete.append(f)
    else:
        unique_bases[basename] = f

print(f"Total files: {len(files)}")
print(f"Unique files: {len(unique_bases)}")

# Upload unique files
print("Starting upload process...")
uploaded_count = 0

for base_name, original_filename in unique_bases.items():
    file_path = os.path.join(music_dir, original_filename)
    
    # Check if already exists in DB to skip upload
    try:
        res = supabase.table("media_metadata").select("id").eq("title", base_name).execute()
        if len(res.data) > 0:
            print(f"Skipping (already in DB): {base_name}")
            continue
    except Exception:
        pass
        
    new_id = str(uuid.uuid4())
    safe_filename = f"{new_id}.mp3"
    
    try:
        # 1. Extract Real Duration using Mutagen
        audio = MP3(file_path)
        duration_str = format_duration(audio.info.length)
        
        # 2. Try to parse "Artist - Title" from filename
        artist = "Personal Cloud"
        title = base_name
        if " - " in base_name:
            parts = base_name.split(" - ", 1)
            artist = parts[0].strip()
            title = parts[1].strip()

        with open(file_path, 'rb') as f:
            file_data = f.read()
            
        # 3. Upload to Storage
        upload_res = supabase.storage.from_(bucket_name).upload(
            path=safe_filename,
            file=file_data,
            file_options={"content-type": "audio/mpeg", "upsert": "true"}
        )
        
        # Get public URL
        public_url = f"{url}/storage/v1/object/public/{bucket_name}/{safe_filename}"
        
        # 4. Insert rich metadata
        meta_res = supabase.table("media_metadata").insert({
            "id": new_id,
            "youtube_id": f"cloud-{new_id[:8]}",
            "title": title,
            "artist": artist,
            "duration": duration_str,
            "url": public_url,
            "type": "audio"
        }).execute()
        
        print(f"✅ Success: {title} by {artist} ({duration_str})")
        uploaded_count += 1
    except Exception as e:
        print(f"❌ Failed to upload {original_filename}: {e}")

print(f"Finished! Uploaded {uploaded_count} new songs.")
