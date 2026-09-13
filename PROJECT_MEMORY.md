# Curator AI - Project Memory & Architecture

## Product Vision
Transform any topic, artist, or vibe into a structured learning path or a curated music mix in seconds. Curator AI sits at the intersection of AI generation and media downloading. 

## Current Tech Stack (Local Prototype)
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, PWA configured.
- **Backend:** Python (FastAPI), Uvicorn.
- **AI/LLM:** Groq API (LLaMA 3 8B) for blazing-fast JSON generation.
- **Media Engine:** `yt-dlp` (threaded) and `zipfile`.

## Core Features (Working)
1. **Universal YouTube RAG:** Scrapes YouTube search context to ground AI responses in real, current media instead of hallucinating.
2. **Pre-Resolved Playlist Bypass:** For queries requesting massive quantities (e.g., >15 items), the backend bypasses individual searches and directly scrapes 100-track YouTube playlists. This prevents IP bans and provides instant URL resolution for the frontend.
3. **Multi-Threaded Zip Engine:** Uses `ThreadPoolExecutor` to download multiple MP3s/MP4s concurrently, zips them in memory/temp disk, and streams the `.zip` archive to the user.

---

## The Production Scaling Roadmap (Next Phases)

### Phase 1: Authentication & User Profiles (In Progress)
- **Tooling:** Supabase (PostgreSQL + Auth) or Firebase.
- **Goal:** Google Login, Email Login, session management.
- **UI:** Login Modals, Avatar dropdown, Credit Tracker.

### Phase 2: Database & Credit System
- **Tables:**
  - `Users`: id, email, auth_provider, credits_remaining, is_premium.
  - `Cache`: query_hash, llm_json_response, created_at, cloudflare_r2_url.
- **Logic:** 
  - Free users get 5 ZIP generation credits/day.
  - Before generating, the backend checks the `Cache` table to see if the query was recently generated. If so, return instantly (Zero LLM/YouTube cost).

### Phase 3: Cloud Infrastructure
- **Frontend Hosting:** Cloudflare Pages (Infinite scaling, free bandwidth).
- **Storage Vault:** Cloudflare R2 (Replaces AWS S3. Zero egress fees for ZIP downloads).
- **Backend Hosting:** Render / Railway / DigitalOcean Droplet (Must support Python and raw OS binaries for `yt-dlp`).
- **Worker Queues:** Redis / Celery (If traffic spikes, put users in a "You are #4 in queue" waiting line to prevent server memory crashes).

---

## Directory Structure
```
curator-ai/
├── frontend/                 # React UI
│   ├── src/
│   │   ├── components/       # Hero, MediaGrid, Roadmap UI
│   │   ├── context/          # AuthContext (State management)
│   │   ├── pages/            # Home
│   │   └── index.css         # Tailwind directives
│   └── vite.config.js        # Vite + PWA config
│
├── backend/                  # FastAPI App
│   ├── main.py               # Endpoints (generate-roadmap, batch-download, progress)
│   ├── services.py           # LLM logic, yt-dlp scraping, Playlist Injection
│   ├── database.py           # DB connection & ORM
│   ├── models.py             # User & Cache schemas
│   └── temp_downloads/       # Ephemeral storage for zipping
└── PROJECT_MEMORY.md         # Architecture documentation
```
