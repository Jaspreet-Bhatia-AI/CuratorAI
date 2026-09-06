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
        },
        {
          "search_query": "Tum Hi Ho Arijit Singh audio",
          "topics_covered": ["Tum Hi Ho"],
          "rationale": "One of the most iconic heartbreak songs."
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
            "noplaylist": True,
            "cookiesfrombrowser": ("brave",),
            "extractor_args": {"youtube": ["player_client=default"]}
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
                st.session_state['original_query'] = user_query
                
                curriculum = roadmap.get('curriculum', [])
                my_bar = st.progress(0, text="Searching YouTube for the best content...")
                seen_urls = set()
                
                for i, step in enumerate(curriculum):
                    query = step.get('search_query', '')
                    best_video = search_best_video(query, seen_urls)
                    if best_video:
                        best_video['topics_covered'] = step.get('topics_covered', [])
                        best_video['rationale'] = step.get('rationale', '')
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
        st.write("### 📑 Course / Song Index")
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
    st.write("### 📺 Curated Media:")
    
    selected_urls = []
    
    for i, vid in enumerate(st.session_state['videos']):
        c1, c2, c3 = st.columns([1, 3, 1])
        with c1:
            if vid.get('thumbnail'):
                st.image(vid['thumbnail'], use_container_width=True)
        with c2:
            st.write(f"**{vid['title']}**")
            
            if vid.get('rationale'):
                st.info(f"💡 **Why this video?** {vid['rationale']}")
            
            if vid.get('topics_covered'):
                st.caption(f"🎯 **Contains:** {', '.join(vid['topics_covered'])}")
                
            stats = []
            if vid.get('views'):
                stats.append(f"👁️ {vid['views']:,} views")
            if vid.get('duration'):
                mins, secs = divmod(vid['duration'], 60)
                stats.append(f"⏱️ {mins}:{secs:02d}")
            if stats:
                st.write(" | ".join(stats))
                
            if vid.get('description'):
                with st.expander("📜 View Full Description & Tracklist"):
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
            
            folder_name = st.session_state.get('original_query', 'AI_Downloads')
            
            for i, url in enumerate(selected_urls):
                progress_bar.progress(i / len(selected_urls), text=f"Downloading item {i+1} of {len(selected_urls)}...")
                if download_yt(url, Type, folder_name):
                    success_count += 1
                    
            progress_bar.progress(1.0, text="Finished!")
            st.success(f"Successfully downloaded {success_count} items to: Downloads/{folder_name}")
            st.balloons()
