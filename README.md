# Curator AI 🎵📚

Transform any topic, artist, or vibe into a structured learning path or a curated music mix in seconds. Curator AI is a **100% free, decentralized desktop app** that sits at the intersection of AI generation and direct-to-device media downloading.

## 🚀 Direct Downloads

| Operating System | Installer Type | Download Link |
|:---|:---|:---|
| 🪟 **Windows** | `.msi` or `.exe` | [👉 Download Latest Release](https://github.com/Jaspreet-Bhatia-AI/CuratorAI/releases/latest) |
| 🍎 **macOS** | `.dmg` | [👉 Download Latest Release](https://github.com/Jaspreet-Bhatia-AI/CuratorAI/releases/latest) |
| 🐧 **Linux** | `.AppImage` or `.deb` | [👉 Download Latest Release](https://github.com/Jaspreet-Bhatia-AI/CuratorAI/releases/latest) |
| 🤖 **Android** | `.apk` | [👉 Download Latest Release](https://github.com/Jaspreet-Bhatia-AI/CuratorAI/releases/latest) |

> **Note:** Click the link above to view the latest versions. Desktop apps are in the Releases tab. For Android, download the `app-universal-release.apk` file from the Assets section and install it on your device.

## ✨ Features
- **Bring Your Own API Key:** Uses your personal Gemini or Groq keys for completely free, unlimited AI generations.
- **Global Caching:** Powered by Supabase. If someone else has already searched your topic, you get the results instantly with 0 latency.
- **Universal Mobile Support:** Built with a blazing-fast Python backend handling media extraction, allowing the app to run perfectly on both desktop (via Tauri) and mobile (via Android/iOS).

## 🛠️ Developer Setup (Run from Source)

If you want to edit the code and run the app locally:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/curator-ai.git
cd curator-ai

# 2. Start the Backend
cd backend
pip install -r requirements.txt
python main.py

# 3. Start the Frontend (Desktop or Android)
cd ../frontend
npm install
npm run tauri dev
# OR for Android:
npm run tauri android dev
```

### Architecture
- **Frontend UI:** React + Vite + TailwindCSS (Material 3 Design)
- **App Wrapper:** Tauri (Rust)
- **Database:** Supabase (PostgreSQL)
- **Backend Extraction:** FastAPI + `yt-dlp` (Python)
