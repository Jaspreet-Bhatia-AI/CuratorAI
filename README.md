# 🎓 AI YouTube Curriculum & Music Downloader

An intelligent, AI-powered application that takes a simple goal (e.g., "Learn Python from scratch" or "Top 20 Romantic Songs") and automatically generates a structured learning roadmap or playlist. It then hunts down the best, highest-viewed videos on YouTube, presents them in a beautiful UI, and batch-downloads them directly to your computer.

Built with **Python**, **Streamlit**, **yt-dlp**, and the **Groq API**.

## Features
* **AI Curriculum Generation:** Uses advanced LLMs (via Groq) to break down massive educational goals into step-by-step, non-repetitive learning roadmaps.
* **Smart Music Curation:** Automatically prioritizes full-length "Mashups", "Jukeboxes", and "Compilations" when searching for music vibes/genres, complete with interactive tracklists.
* **Batch Downloading:** Select the videos you want and download them all at once as MP4 (Video) or MP3 (Audio).
* **Auto-Organization:** Downloads are safely grouped into clean folders inside your `Downloads` directory, named exactly after your prompt.

---

##  Getting Started

### 1. Prerequisites
* **Python 3.8+** installed on your system.
* **FFmpeg** installed (Required by `yt-dlp` to convert videos to MP3 audio).
  * *Ubuntu/Linux:* `sudo apt install ffmpeg`
  * *Mac:* `brew install ffmpeg`
  * *Windows:* Download via `winget install ffmpeg`
* A **Groq API Key** (You can get one for free at [console.groq.com](https://console.groq.com)).

### 2. Installation
Clone the repository and install the required Python packages:

```bash
git clone https://github.com/Jaspreet-Bhatia-AI/youtube-downloader.git
cd youtube-downloader

# (Optional but recommended) Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Setup your API Key
Create a hidden `.env` file in the root directory to store your Groq API key securely. 

```bash
touch .env
```
Open the `.env` file and add your key like this:
```env
GROQ_API_KEY=gsk_your_api_key_here
```
*(Note: `.env` is included in `.gitignore`, so your key will never be uploaded to GitHub).*

### 4. Run the App
Launch the Streamlit web interface:
```bash
streamlit run app.py
```

---

## 🛠️ How to Use
1. Open the local URL provided by Streamlit (usually `http://localhost:8501`).
2. Type a goal into the search bar (e.g., *"Complete guide to Object Oriented Programming"* or *"Late night drive lofi music"*).
3. Click **Generate AI Plan**. 
4. Review the generated Course Index / Tracklists.
5. Check or uncheck the videos you want to keep.
6. Select your preferred format (**Video** or **Audio**).
7. Click **Download**. Your files will be waiting for you in your computer's `Downloads` folder!
