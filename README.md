# YouTube Video Downloader

A sleek, fast, and highly capable Media Downloader built entirely in Python. It currently provides a simple web interface to extract, download, and preview high-quality video and audio directly from YouTube.

## 💡 About The Project

This project is built to simplify the often clunky process of downloading media from YouTube. Unlike many ad-heavy web downloaders, this app offers a clean, straightforward interface that handles both individual videos and entire playlists seamlessly. 

The core philosophy of this project is **simplicity**. It strips away complex configurations and gives the user exactly what they want: a URL input, a choice between Video (MP4) or Audio (MP3), and an instant download button.

## 🏗️ How It Was Made

The application is built using a modern Python tech stack, focusing on two main components:

### 1. The Frontend (Streamlit)
The user interface is powered by **[Streamlit](https://streamlit.io/)**. Streamlit allows us to rapidly build a reactive web application purely in Python without writing raw HTML or JavaScript. 
- It handles state management (like showing loading balloons and spinners while files download).
- It dynamically generates UI components. For example, if a user downloads a playlist of 10 songs, the app dynamically loops through the downloaded folder and renders 10 distinct audio players and 10 unique download buttons on the fly.

### 2. The Engine (yt-dlp)
The heavy lifting of extracting media from YouTube is handled by **[yt-dlp](https://github.com/yt-dlp/yt-dlp)**, an incredibly powerful media downloader.
- **Dynamic Configuration:** We pass dynamic option dictionaries to `yt-dlp` depending on the user's request. If the user wants audio, we inject the `FFmpegExtractAudio` post-processor into the code to automatically rip the audio and convert it to a 192kbps MP3.
- **Intelligent Routing:** The Python logic automatically detects if a URL is a standard video or a full playlist. 
  - For single videos, it extracts the file, cleans up the filename, and returns the single file path.
  - For playlists, it saves the media into a dedicated folder based on the playlist title, and returns a compiled list of all the downloaded files so the UI can render them in a batch.

## 🚀 Deployment Next Steps
This project is designed to be easily deployable to modern cloud hosting platforms, allowing users to access the downloader from anywhere!
