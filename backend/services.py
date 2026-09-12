from yt_dlp import YoutubeDL as yt
import os
import json
import re
import shutil
from groq import Groq
from dotenv import load_dotenv
from ddgs import DDGS

load_dotenv()
client = Groq()

node_path = shutil.which("node")

DOWNLOAD_PROGRESS = {}

def get_progress_hook(task_id):
    def hook(d):
        if not task_id: return
        if d['status'] == 'downloading':
            p = d.get('_percent_str', '0%').strip()
            p = re.sub(r'\x1b\[[0-9;]*m', '', p)
            DOWNLOAD_PROGRESS[task_id] = {"status": "downloading", "percent": p}
        elif d['status'] == 'finished':
            DOWNLOAD_PROGRESS[task_id] = {"status": "processing", "percent": "100%"}
    return hook

def extract_url_to_roadmap(url: str):
    ydl_opts_fast = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": "in_playlist",
        "extractor_args": {"youtube": ["player_client=ios,web"]}
    }
    if node_path:
        ydl_opts_fast["js_runtimes"] = {'node': {'binary': node_path}}
        
    with yt(ydl_opts_fast) as yd:
        info = yd.extract_info(url, download=False)
        
        curriculum = []
        is_playlist = 'entries' in info and info.get('entries') is not None
        
        if is_playlist:
            title = info.get("title", "Curated Playlist")
            entries = list(info['entries'])
            for idx, entry in enumerate(entries):
                vid_url = entry.get("url")
                if not vid_url and entry.get("id"):
                    vid_url = f"https://www.youtube.com/watch?v={entry.get('id')}"
                if vid_url:
                    curriculum.append({
                        "search_query": vid_url,
                        "topics_covered": [entry.get("title", f"Video {idx+1}")],
                        "rationale": "Fetched from playlist URL."
                    })
        else:
            title = info.get("title", "Curated Video")
            vid_url = info.get("webpage_url", url)
            curriculum.append({
                "search_query": vid_url,
                "topics_covered": [title],
                "rationale": "Fetched from direct URL."
            })
            
        return {
            "type": "music" if "music" in title.lower() else "education",
            "title": title,
            "roadmap_overview": [
                {
                    "main_topic": "Extracted Media",
                    "sub_topics": [c["topics_covered"][0] for c in curriculum]
                }
            ],
            "curriculum": curriculum
        }

def generate_roadmap_json(user_query: str):
    if user_query.startswith("http://") or user_query.startswith("https://"):
        return extract_url_to_roadmap(user_query)

    system_prompt = """You are an expert curriculum designer and curator.
Your task is to take the user's request and structure it into a logical JSON roadmap or playlist.

IMPORTANT CURATION RULES:
- FOR MUSIC: NEVER invent songs. If provided with OFFICIAL MUSIC DATABASE RESULTS, you MUST build your playlist using strictly those exact track names. DO NOT invent any songs.
- FOR MUSIC: To ensure the correct official video is fetched, your search_query MUST be perfectly formatted as: "{Exact Track Name} {Artist Name} Official Audio" (e.g., "Dildarian Amrinder Gill Official Audio").
- Provide a "rationale" explaining exactly WHY you chose this item/song.

Output ONLY raw JSON with this exact schema:
{
  "type": "music",
  "title": "Amrinder Gill Collection",
  "roadmap_overview": [
    {
      "main_topic": "Playlist",
      "sub_topics": ["Dildarian", "Pendu"]
    }
  ],
  "curriculum": [
    {
      "search_query": "Dildarian Amrinder Gill Official Audio",
      "topics_covered": ["Dildarian"],
      "rationale": "One of his most famous classic hits."
    }
  ]
}"""
    
    try:
        realtime_context = ""
        music_keywords = ["song", "songs", "music", "audio", "playlist", "singer", "artist", "beats", "lofi"]
        is_music_query = any(kw in user_query.lower() for kw in music_keywords)
        
        if not is_music_query:
            try:
                results = DDGS().text(user_query, max_results=4)
                if results:
                    realtime_context = "REAL-TIME INTERNET SEARCH RESULTS TO AUGMENT YOUR KNOWLEDGE:\n"
                    for r in results:
                        realtime_context += f"- {r.get('title')}: {r.get('body')}\n"
            except Exception as e:
                pass
        else:
            try:
                import urllib.request, urllib.parse, json
                url = f"https://itunes.apple.com/search?term={urllib.parse.quote(user_query)}&entity=song&limit=50"
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=5) as response:
                    data = json.loads(response.read())
                    if 'results' in data and len(data['results']) > 0:
                        realtime_context = "OFFICIAL MUSIC DATABASE RESULTS (USE THESE EXACT TRACK NAMES FOR YOUR PLAYLIST):\n"
                        
                        # Sort by releaseDate descending to guarantee newest songs are prioritized
                        sorted_tracks = sorted(
                            data['results'], 
                            key=lambda x: x.get('releaseDate', '1970-01-01'), 
                            reverse=True
                        )
                        
                        # Take the top 15 newest
                        for i, track in enumerate(sorted_tracks[:15]):
                            t_name = track.get('trackName', '')
                            a_name = track.get('artistName', '')
                            r_date = track.get('releaseDate', '')[:4]
                            realtime_context += f"- {t_name} by {a_name} (Released: {r_date})\n"
            except Exception as e:
                pass
                
        # Combine user query with real-time context
        augmented_query = user_query
        if realtime_context:
            augmented_query = f"User Request: {user_query}\n\n{realtime_context}\n\nBased on the user request and the real-time internet context above, generate the JSON output."

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": augmented_query}
            ],
            model="openai/gpt-oss-120b",
            max_tokens=8000,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise Exception(f"AI Error: {e}")

def search_youtube(query: str, search_type: str = "education", original_query: str = None):
    ydl_opts_fast = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "noplaylist": True,
        "cookiesfrombrowser": ("brave",),
        "extractor_args": {"youtube": ["player_client=ios,web"]}
    }
    ydl_opts_full = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "extractor_args": {"youtube": ["player_client=ios,web"]}
    }
    
    if node_path:
        ydl_opts_fast["js_runtimes"] = {'node': {'binary': node_path}}
        ydl_opts_full["js_runtimes"] = {'node': {'binary': node_path}}
        
    try:
        with yt(ydl_opts_fast) as yd:
            if query.startswith("http://") or query.startswith("https://"):
                info = yd.extract_info(query, download=False)
                best = info
                url = info.get("webpage_url", query)
            else:
                info = yd.extract_info(f"ytsearch5:{query}", download=False)
                if 'entries' in info and len(info['entries']) > 0:
                    entries = list(info['entries'])
                    valid_entries = [e for e in entries if e.get('view_count') is not None]
                    if not valid_entries:
                        valid_entries = entries
                    if search_type != "music":
                        valid_entries = [sorted(valid_entries, key=lambda x: x.get('view_count', 0), reverse=True)[0]]
                else:
                    raise Exception("No results found.")
                
            for best in valid_entries:
                url = best.get("url")
                full_desc = ""
                raw_date = best.get("upload_date")
                likes = best.get("like_count")
                channel = best.get("uploader") or best.get("channel")
                try:
                    with yt(ydl_opts_full) as yd_full:
                        full_info = yd_full.extract_info(url, download=False)
                        full_desc = full_info.get("description", "")
                        if full_info.get("upload_date"):
                            raw_date = full_info.get("upload_date")
                        if full_info.get("like_count"):
                            likes = full_info.get("like_count")
                        if full_info.get("uploader") or full_info.get("channel"):
                            channel = full_info.get("uploader") or full_info.get("channel")
                except:
                    full_desc = best.get("description", "")
                formatted_date = None
                if raw_date and len(raw_date) == 8:
                    try:
                        import datetime
                        formatted_date = datetime.datetime.strptime(raw_date, "%Y%m%d").strftime("%b %d, %Y")
                    except:
                        formatted_date = raw_date
                
                # Date filtering logic
                if original_query and search_type == "music":
                    orig = original_query.lower()
                    is_latest_req = "latest" in orig or "new" in orig or "recent" in orig
                    if is_latest_req and raw_date and len(raw_date) == 8:
                        try:
                            year = int(raw_date[:4])
                            import datetime
                            current_year = datetime.datetime.now().year
                            # Reject if older than 3 years when "latest" is explicitly requested
                            if current_year - year > 3:
                                continue # SKIP THIS OLD VIDEO AND TRY THE NEXT ONE
                        except:
                            pass
                            
                return {
                    "title": best.get("title", "Unknown"),
                    "url": url,
                    "thumbnail": best.get("thumbnails", [{}])[-1].get("url") if best.get("thumbnails") else None,
                    "views": best.get("view_count"),
                    "duration": best.get("duration"),
                    "description": full_desc,
                    "upload_date": formatted_date,
                    "channel": channel,
                    "likes": likes
                }
            return None # All videos failed the date filter
    except Exception as e:
        print(f"Search error for {query}: {e}")
    return None

def download_video(url: str, output_dir: str, format_type: str = "video_high", task_id: str = None):
    import uuid
    os.makedirs(output_dir, exist_ok=True)
    
    outtmpl = os.path.join(output_dir, f"%(title)s_{uuid.uuid4().hex[:6]}.%(ext)s")
    
    if format_type == "audio":
        ydl_opts = {
            "outtmpl": outtmpl,
            "format": "bestaudio/best",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }],
            "quiet": True,
            "no_warnings": True,
            "progress_hooks": [get_progress_hook(task_id)] if task_id else []
        }
    elif format_type == "video_fast":
        ydl_opts = {
            "outtmpl": outtmpl,
            "format": "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            "merge_output_format": "mp4",
            "quiet": True,
            "no_warnings": True,
            "progress_hooks": [get_progress_hook(task_id)] if task_id else []
        }
    else:
        # video_high
        ydl_opts = {
            "outtmpl": outtmpl,
            "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            "merge_output_format": "mp4",
            "quiet": True,
            "no_warnings": True,
            "progress_hooks": [get_progress_hook(task_id)] if task_id else []
        }
    
    if node_path:
        ydl_opts["js_runtimes"] = {'node': {'binary': node_path}}
        
    try:
        with yt(ydl_opts) as yd:
            info = yd.extract_info(url, download=True)
            filename = yd.prepare_filename(info)
            base, _ = os.path.splitext(filename)
            
            if format_type == "audio" and os.path.exists(f"{base}.mp3"):
                return f"{base}.mp3"
                
            if os.path.exists(f"{base}.mp4"):
                return f"{base}.mp4"
            if os.path.exists(f"{base}.mkv"):
                return f"{base}.mkv"
            return filename
    except Exception as e:
        print(f"Download failed for {url}: {e}")
        return None
