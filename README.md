# Curator AI 🎵📚

Transform any topic, artist, or vibe into a structured learning path or a curated music mix in seconds. Curator AI is a **100% free, decentralized desktop app** that sits at the intersection of AI generation and direct-to-device media downloading.

## 🚀 Download for Windows, Mac, and Linux

You no longer need to host a server or use Docker. The entire app runs natively on your computer!

1. Go to the [Releases Tab](../../releases) on this GitHub page.
2. Download the installer for your operating system:
   - **Windows:** Download the `.msi` or `.exe`
   - **Mac:** Download the `.dmg`
   - **Linux:** Download the `.AppImage` or `.deb`
3. Install and run it!

## ✨ Features
- **Bring Your Own API Key:** Uses your personal Gemini or Groq keys for completely free, unlimited AI generations.
- **Global Caching:** Powered by Supabase. If someone else has already searched your topic, you get the results instantly with 0 latency.
- **Native Downloading:** Features a bundled `yt-dlp` Rust sidecar that downloads audio securely and directly to your computer's Downloads folder without any backend server proxy.

## 🛠️ Developer Setup (Run from Source)

If you want to edit the code and run the app locally:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/curator-ai.git
cd curator-ai/frontend

# 2. Install dependencies
npm install

# 3. Start the Tauri Desktop Dev Environment
npx tauri dev
```

### Architecture
- **Frontend UI:** React + Vite + TailwindCSS
- **Desktop Shell:** Tauri (Rust)
- **Database:** Supabase (PostgreSQL)
- **Extraction Engine:** `yt-dlp` Sidecar Binary
