from yt_dlp import YoutubeDL as yt
import os
import streamlit as st

st.set_page_config(page_title="Downloader", page_icon= "📥", layout="centered")

st.title("Youtube Instagram Downloader")
st.subheader("Download YouTube and Instagram Audio, Video and Playlist at best quality available.")
st.warning("Currently Instagram Downloader feature is not available at the moment. We will forward you to another downloader site.")
c1,c2=st.columns([1,1])
with c1:
    st.info("Explore youtube:")
    st.page_link(label= "Youtube (Click Here)", page= "https://www.youtube.com")
with c2:
    st.info("Explore instagram:")
    st.page_link(label= "Instagram (Click Here)", page= "https://www.instagram.com")

def download_yt(url, Type, is_playlist):
    if Type == "Video":
        format = "bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[ext=mp4]/best"
        ext, postprocessors = "mp4", []
    else:
        format = 'bestaudio/best'
        ext, postprocessors = "mp3", [{'key': 'FFmpegExtractAudio', 'preferredcodec': 'mp3', 'preferredquality': '192'}]
        
    outtmpl = "%(playlist_title)s/%(playlist_index)s - %(title)s.%(ext)s" if is_playlist else "%(title)s.%(ext)s"

    try:
        ydl_opts={
            "format": format,
            "postprocessors": postprocessors,
            "outtmpl": outtmpl,
            "quiet": True,
            "ignoreerrors": is_playlist,
            "no_warnings": True,
            "js_runtimes": {"node": {}},
            "extractor_args": {"youtube": ["player_client=tv"]}
        }
        
        with yt(ydl_opts) as yd:
            info = yd.extract_info(url, download=True)
            if not info: return None
            
            if is_playlist:
                title = info.get('title', 'Playlist')
                return [os.path.join(title, f) for f in sorted(os.listdir(title))] if os.path.exists(title) else []
            else:
                temp_name = yd.prepare_filename(info)
                file_name = "_".join(temp_name.split("#")[0].split(" "))+f".{ext}"
                os.rename(temp_name, file_name)
                return file_name
    except Exception as e:
        st.error(e)

def ig_video(url): pass
def ig_audio(url): pass

def preview(file_or_files, Type):
    if not file_or_files: return
    files = file_or_files if isinstance(file_or_files, list) else [file_or_files]
    
    for i, file in enumerate(files):
        if len(files) > 1: st.write(f"### {os.path.basename(file)}")
            
        if Type == "Video":
            st.video(file, width=400)
            mime = "video/mp4"
        else:
            st.audio(file, width=300)
            mime = "audio/mp3"
            
        with open(file, "rb") as f:
            st.download_button(
                label="Download", data=f, file_name=os.path.basename(file),
                mime=mime, key=f"dl_{i}_{file}"
            )

with st.form("url"):
    url=st.text_input("Enter the URL of the video you want to download")
    platform = "YouTube" if "youtube.com" in url else "Instagram" if "instagram.com" in url else None
    if url and not platform: st.error("Invalid URL")
    Type=st.radio("Select Type (Individual/Playlist)", ("Video","Audio"))
    btn=st.form_submit_button("Download")

if btn:
    if platform and url and Type:
        with st.spinner(f"Downloading the {platform} {Type}..."):
            if platform=="YouTube":
                file = download_yt(url, Type, "playlist?list=" in url)
                if file:
                    st.success("Download complete!")
                    st.balloons()
                    preview(file, Type)
            else:
                st.page_link(label="Go to Instagram Downloader(Click Here)", page="https://snapinsta.to/en46")
    else:
        st.error("Please fill all the fields")

