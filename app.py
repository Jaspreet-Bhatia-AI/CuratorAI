from yt_dlp import YoutubeDL as yt
import os
import json
import re
import streamlit as st
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq()

st.set_page_config(page_title="AI Curriculum Downloader", page_icon="🎓", layout="centered")

st.title("AI Smart Downloader & Curator")
st.subheader("Tell the AI what you want to learn or listen to. It will build a plan, find the best videos, and download them for you!")

# ----------------- AI LOGIC -----------------
def generate_roadmap(user_query):
    system_prompt = """You are an expert AI curriculum builder and media curator.
    The user will give you a goal (e.g., 'learn OOPs in python', 'romantic songs').
    
    1. Determine if the request is 'education', 'music', or 'general'.
    2. For educational goals, define a comprehensive curriculum INDEX in "roadmap_overview". 
    3. Generate between 1 and 50 steps (videos) depending on the scope.
    4. For each step, provide a highly optimized YouTube search query AND list exactly which sub-topics are covered.
    
    IMPORTANT RULES:
    - DO NOT create overlapping or repetitive topics.
    - If the user asks for MUSIC (moods, genres, or artists), highly prioritize queries for long-form "Mashups", "Jukeboxes", or "Compilations" (e.g. "Top 50 Romantic Songs Mashup").
    
    Output ONLY raw JSON with this exact schema:
    {
      "type": "education",
      "title": "Mastering OOPs in Python",
      "roadmap_overview": [
        {
          "main_topic": "OOP Basics",
          "sub_topics": ["Classes and Objects", "The self keyword"]
        }
      ],
      "curriculum": [
        {
          "search_query": "Python OOP Classes, objects, and self tutorial",
          "topics_covered": ["Classes and Objects"]
        }
      ]
    }
    For music/general, adapt the structure. For music, list the Vibe/Artist as main_topic, and prioritize Mashup queries!"""
    
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            model="openai/gpt-oss-120b",
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        st.error(f"AI Error: {e}")
        return None

# ----------------- SEARCH LOGIC -----------------
def search_best_video(query, seen_urls):
    ydl_opts_fast = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "extractor_args": {"youtube": ["player_client=tv"]},
        "cookiesfrombrowser": ("brave",)
    }
    ydl_opts_full = {
        "quiet": True,
        "no_warnings": True,
        "extractor_args": {"youtube": ["player_client=tv"]},
        "cookiesfrombrowser": ("brave",)
    }
    
    try:
        with yt(ydl_opts_fast) as yd:
            info = yd.extract_info(f"ytsearch5:{query}", download=False)
            if 'entries' in info and len(info['entries']) > 0:
                entries = list(info['entries'])
                
                valid_entries = [e for e in entries if e.get('view_count') is not None]
                if not valid_entries:
                    valid_entries = entries
                else:
                    valid_entries.sort(key=lambda x: x['view_count'], reverse=True)
                
                for best in valid_entries:
                    url = best.get("url")
                    if url not in seen_urls:
                        seen_urls.add(url)
                        
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
        pass
    return None

# ----------------- DOWNLOAD LOGIC -----------------
def download_yt(url, Type, folder_name=""):
    base_dir = os.path.expanduser("~/Downloads")
    
    # Clean the user's query so it's a safe folder name (removes invalid characters)
    safe_folder = re.sub(r'[\\/*?:"<>|]', "", folder_name).strip() if folder_name else "AI_Downloads"
    downloads_dir = os.path.join(base_dir, safe_folder)
    
    if not os.path.exists(downloads_dir):
        os.makedirs(downloads_dir)
    
    if Type == "Video":
        format = "bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[ext=mp4]/best"
        ext, postprocessors = "mp4", []
    else:
        format = 'bestaudio/best'
        ext, postprocessors = "mp3", [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '192'}]
        
    outtmpl = os.path.join(downloads_dir, "%(title)s.%(ext)s")

    try:
        ydl_opts={
            "format": format,
            "postprocessors": postprocessors,
            "outtmpl": outtmpl,
            "quiet": True,
            "no_warnings": True,
            "extractor_args": {"youtube": ["player_client=tv"]},
        "cookiesfrombrowser": ("brave",)
        }
        with yt(ydl_opts) as yd:
            info = yd.extract_info(url, download=True)
            temp_name = yd.prepare_filename(info)
            try:
                file_name = "_".join(temp_name.split("#")[0].split(" "))
                if not file_name.endswith(f".{ext}"):
                    file_name += f".{ext}"
                if os.path.exists(temp_name):
                    os.rename(temp_name, file_name)
                elif os.path.exists(temp_name.replace(".webm", ".mp3").replace(".m4a", ".mp3")):
                    file_name = temp_name.replace(".webm", ".mp3").replace(".m4a", ".mp3")
            except:
                file_name = temp_name
            return file_name
    except Exception as e:
        st.error(f"Failed to download {url}: {e}")
        return None

# ----------------- UI FLOW -----------------
user_query = st.text_input("Enter your goal (e.g., 'Learn OOPs in python' or 'Top 5 Diljit Dosanjh songs')")

if st.button("Generate AI Plan"):
    if user_query:
        with st.spinner("AI is analyzing your request and building a detailed roadmap..."):
            roadmap = generate_roadmap(user_query)
            if roadmap:
                st.session_state['roadmap'] = roadmap
                st.session_state['videos'] = []
                st.session_state['original_query'] = user_query  # Save query for the folder name
                
                curriculum = roadmap.get('curriculum', [])
                my_bar = st.progress(0, text="Searching YouTube for the best content...")
                seen_urls = set()
                
                for i, step in enumerate(curriculum):
                    query = step.get('search_query', '')
                    best_video = search_best_video(query, seen_urls)
                    if best_video:
                        best_video['topics_covered'] = step.get('topics_covered', [])
                        st.session_state['videos'].append(best_video)
                    
                    my_bar.progress((i + 1) / max(1, len(curriculum)), text=f"Found: {best_video['title'] if best_video else 'Skipped'}")
                
                my_bar.empty()
    else:
        st.error("Please enter a query first!")

if 'roadmap' in st.session_state and 'videos' in st.session_state:
    st.write("---")
    roadmap = st.session_state['roadmap']
    st.header(f"🧠 {roadmap.get('title', 'Your Custom Plan')}")
    
    if roadmap.get('roadmap_overview'):
        st.write("### 📑 Course Index")
        overview = roadmap['roadmap_overview']
        
        if len(overview) > 0 and isinstance(overview[0], str):
            for i, topic in enumerate(overview):
                st.markdown(f"- {topic}")
        else:
            for i, section in enumerate(overview):
                main_topic = section.get('main_topic', 'Topic')
                st.markdown(f"#### {i+1}. {main_topic}")
                
                sub_topics = section.get('sub_topics', [])
                for sub in sub_topics:
                    st.markdown(f"&nbsp;&nbsp;&nbsp;&nbsp; 🔹 {sub}")
        
    st.write("---")
    st.write("### 📺 Curated Videos:")
    
    selected_urls = []
    
    for i, vid in enumerate(st.session_state['videos']):
        c1, c2, c3 = st.columns([1, 3, 1])
        with c1:
            if vid.get('thumbnail'):
                st.image(vid['thumbnail'], use_container_width=True)
        with c2:
            st.write(f"**{vid['title']}**")
            
            if vid.get('topics_covered'):
                st.caption(f"🎯 **Covers:** {', '.join(vid['topics_covered'])}")
                
            stats = []
            if vid.get('views'):
                stats.append(f"👁️ {vid['views']:,} views")
            if vid.get('duration'):
                mins, secs = divmod(vid['duration'], 60)
                stats.append(f"⏱️ {mins}:{secs:02d}")
            if stats:
                st.write(" | ".join(stats))
                
            if vid.get('description'):
                with st.expander("📜 View Tracklist & Description"):
                    st.text(vid['description'])
                
        with c3:
            if st.checkbox("Select for Download", value=True, key=f"chk_{i}"):
                selected_urls.append(vid['url'])
        st.write("---")
    
    if len(selected_urls) > 0:
        st.write("### Download Settings")
        is_music = roadmap.get('type') == 'music'
        default_idx = 1 if is_music else 0
        Type = st.radio("Select Format:", ("Video", "Audio"), index=default_idx)
        
        if st.button(f"📥 Download {len(selected_urls)} Items to Computer"):
            progress_bar = st.progress(0, text="Starting downloads...")
            success_count = 0
            
            # Retrieve the query to name the folder!
            folder_name = st.session_state.get('original_query', 'AI_Downloads')
            
            for i, url in enumerate(selected_urls):
                progress_bar.progress(i / len(selected_urls), text=f"Downloading item {i+1} of {len(selected_urls)}...")
                if download_yt(url, Type, folder_name):
                    success_count += 1
                    
            progress_bar.progress(1.0, text="Finished!")
            st.success(f"Successfully downloaded {success_count} items to: Downloads/{folder_name}")
            st.balloons()
