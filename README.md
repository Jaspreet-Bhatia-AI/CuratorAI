# Curator AI 🎵📚

Transform any topic, artist, or vibe into a structured learning path or a curated music mix in seconds. Curator AI sits at the intersection of AI generation and media downloading.

## 🚀 One-Command Install (Mac, Linux, Windows)

You can run the entire Curator AI app (Frontend + Python Backend + Media Downloader) locally with one single command. 

**Prerequisite:** Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/curator-ai.git
cd curator-ai
```

### 2. Add your Groq API Key
Create a `.env` file in the root directory:
```bash
echo "GROQ_API_KEY=your_api_key_here" > .env
```

### 3. Launch the App!
Run this exact command in your terminal:
```bash
docker compose up -d --build
```

That's it! 
- 🌐 **Open on your PC:** Go to `http://localhost:8080`
- 📱 **Open on your Phone (PWA):** Ensure your phone is on the same WiFi as your computer. Find your computer's local IP address (e.g., `192.168.1.50`) and open `http://192.168.1.50:8080` in Safari/Chrome. You can click "Add to Home Screen" to install it natively!

---

## Architecture
- **Frontend:** React + Vite (served via Nginx)
- **Backend:** Python FastAPI (using Groq LLaMA-3)
- **Engine:** `yt-dlp` threaded media downloader
