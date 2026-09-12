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

    system_prompt = """You are an elite AI Curator specializing in both Educational Roadmaps AND Music Playlists.
    The user will give you a request (e.g., 'Learn Python OOP' or '30 sad songs in hindi').
    
    1. Determine the intent: "education", "music", or "entertainment". Set this as the "type" field.
    2. Define the structure in "roadmap_overview":
       - FOR EDUCATION: Create a step-by-step timeline (e.g., Week 1, Week 2).
       - FOR MUSIC: Create playlist sections or moods (e.g., "90s Classics", "Upbeat Hooks"). If the user asks for a specific number (e.g., '30 songs'), generate EXACTLY 30 song titles split across these sections as 'sub_topics'.
    3. Generate the actual YouTube search queries in the "curriculum" array.
    
    IMPORTANT CURATION RULES:
    - FOR MUSIC: You MUST output exactly the number of songs requested! Map exactly ONE song per video item. Write the search query as "Song Name Artist Audio".
    - FOR EDUCATION: DO NOT create overlapping topics. Provide clear chronological steps.
    - Provide a "rationale" explaining exactly WHY you chose this item/song.
    
    Output ONLY raw JSON with this exact schema:
    {
      "type": "music", // or "education"
      "title": "Ultimate Hindi Sad Songs Collection",
      "roadmap_overview": [
        {
          "main_topic": "Heartbreak Anthems",
          "sub_topics": ["Channa Mereya", "Tum Hi Ho"]
        }
      ],
      "curriculum": [
        {
          "search_query": "Channa Mereya official audio",
          "topics_covered": ["Channa Mereya"],
          "rationale": "A timeless classic that perfectly fits the sad vibe requested."
        }
      ]
    }"""
    
    try:
        # Step 1: Perform a real-time web search to augment Groq's knowledge
        realtime_context = ""
        try:
            results = DDGS().text(user_query, max_results=4)
            if results:
                realtime_context = "REAL-TIME INTERNET SEARCH RESULTS TO AUGMENT YOUR KNOWLEDGE:\n"
                for r in results:
                    realtime_context += f"- {r.get('title')}: {r.get('body')}\n"
        except Exception as e:
            print(f"Web search failed: {e}")
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

def search_youtube(query: str, search_type: str = "education"):
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
        "cookiesfrombrowser": ("brave",),
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
                    if search_type == "music":
                        best = valid_entries[0]
                    else:
                        valid_entries = sorted(valid_entries, key=lambda x: x.get('view_count', 0), reverse=True)
                        best = valid_entries[0]
                    url = best.get("url")
                else:
                    raise Exception("No results found.")
                
                full_desc = ""
                try:
                    with yt(ydl_opts_full) as yd_full:
                        full_info = yd_full.extract_info(url, download=False)
                        full_desc = full_info.get("description", "")
                except:
                    full_desc = best.get("description", "")
                    
                return {
                    "title": best.get("title", "Unknown"),
                    "url": url,
                    "thumbnail": best.get("thumbnails", [{}])[-1].get("url") if best.get("thumbnails") else None,
                    "views": best.get("view_count"),
                    "duration": best.get("duration"),
                    "description": full_desc
                }
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
