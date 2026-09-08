from yt_dlp import YoutubeDL as yt
import os
import json
import re
import shutil
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq()

node_path = shutil.which("node")

def generate_roadmap_json(user_query: str):
    system_prompt = """You are an elite AI curriculum architect and YouTube curation expert.
    The user will give you a request (e.g., 'Learn Python OOP', '30 sad songs in hindi').
    
    1. Determine if the category is 'education', 'music', or 'entertainment/general'.
    2. Define a comprehensive, nested INDEX in "roadmap_overview".
       - For MUSIC: If the user asks for a specific amount (e.g. 30 songs), you MUST generate EXACTLY 30 specific song titles as 'sub_topics'. DO NOT TRUNCATE.
    3. Generate the actual videos in the "curriculum" array.
    
    IMPORTANT CURATION RULES:
    - You must write highly-optimized YouTube search queries.
    - FOR NUMBERED MUSIC REQUESTS (e.g. '30 songs'): You MUST generate EXACTLY that many items in the "curriculum" array (e.g. 30 items). Map exactly ONE song per video! DO NOT group them into mashups! Write the search query as "Song Name Artist Audio".
    - FOR GENERAL MUSIC REQUESTS (no specific number): Prioritize long-form "Mashups" and "Jukeboxes".
    - DO NOT create overlapping topics for education.
    - Provide a "rationale" explaining exactly WHY you chose this step.
    
    Output ONLY raw JSON with this exact schema:
    {
      "type": "music",
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
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            model="openai/gpt-oss-120b",
            max_tokens=8000,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise Exception(f"AI Error: {e}")

def search_youtube(query: str):
    ydl_opts_fast = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "noplaylist": True,
        "cookiesfrombrowser": ("brave",),
        "extractor_args": {"youtube": ["player_client=default"]}
    }
    ydl_opts_full = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "cookiesfrombrowser": ("brave",),
        "extractor_args": {"youtube": ["player_client=default"]}
    }
    
    if node_path:
        ydl_opts_fast["js_runtimes"] = {'node': {'binary': node_path}}
        ydl_opts_full["js_runtimes"] = {'node': {'binary': node_path}}
        
    try:
        with yt(ydl_opts_fast) as yd:
            info = yd.extract_info(f"ytsearch5:{query}", download=False)
            if 'entries' in info and len(info['entries']) > 0:
                entries = list(info['entries'])
                
                valid_entries = [e for e in entries if e.get('view_count') is not None]
                valid_entries = valid_entries if not valid_entries else sorted(valid_entries, key=lambda x: x['view_count'], reverse=True)
                
                best = valid_entries[0]
                url = best.get("url")
                
                # Fetch full description
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

