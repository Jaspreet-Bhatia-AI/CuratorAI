# CuratorAI (AI YouTube Downloader) 🚀

CuratorAI is a next-generation full-stack application that leverages Large Language Models (LLMs) to automatically generate highly-optimized learning roadmaps and music playlists. It instantly queries YouTube to find the perfect videos for every step, provides a sleek interactive dashboard to filter results, and allows you to download the actual `.mp4` video files directly to your device.

## ✨ Features
- **AI-Powered Roadmaps:** Type in any topic (e.g., "Learn Python OOP" or "30 sad songs in hindi"), and the Groq LLM will architect a complete step-by-step curriculum.
- **Smart Filtering & Deduplication:** Click on any step in the roadmap to instantly filter the video grid. Duplicate videos covering multiple topics are automatically merged.
- **Beautiful UI/UX:** Built with React, Tailwind CSS, and Framer Motion for a fluid, glassmorphism-inspired "Google Stitch" aesthetic.
- **Direct Video Downloads:** Select multiple videos and download them straight to your local `Downloads` folder using a robust FastAPI + `yt-dlp` backend pipeline.
- **Anti-Bot Evasion:** Backend utilizes Node.js injection and optimized `yt-dlp` arguments to bypass YouTube bot detection seamlessly.

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS v4, Framer Motion, React Router.
- **Backend:** Python, FastAPI, Uvicorn, `yt-dlp`.
- **AI Integration:** Groq API (`openai/gpt-oss-120b`).
- **Process Management:** PM2.

---

## ⚙️ Setup & Installation

### Prerequisites
Make sure you have the following installed on your system:
- **Python 3.10+**
- **Node.js & npm** (Required for Vite and `yt-dlp` JS evaluation)
- **PM2** (Install globally via `npm install -g pm2`)

### 1. Clone the Repository
```bash
git clone https://github.com/Jaspreet-Bhatia-AI/CuratorAI.git
cd CuratorAI
```
*(Note: Replace the URL with your actual GitHub repository URL if renamed).*

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn yt-dlp groq python-dotenv
```
Create a `.env` file in the `backend/` directory and add your Groq API Key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 🚀 Running the App via PM2 (Localhost / Network)

To run both the frontend and backend continuously in the background, we use PM2. 

### Start the FastAPI Backend
Because we are using a Python virtual environment, we must explicitly tell PM2 to use the `venv` interpreter to avoid syntax crashes.
```bash
cd backend
pm2 start venv/bin/uvicorn --name "yt-backend" --interpreter venv/bin/python -- main:app --host 0.0.0.0 --port 8000
```

### Start the React Frontend
Open a new terminal or navigate back to the frontend directory:
```bash
cd ../frontend
pm2 start npm --name "yt-frontend" -- run dev
```

### Useful PM2 Commands
- **Check Status:** `pm2 status`
- **View Logs:** `pm2 logs` (or `pm2 logs yt-backend` / `pm2 logs yt-frontend`)
- **Stop App:** `pm2 stop all`
- **Restart App:** `pm2 restart all`

---

## 🌐 Accessing the App
Once both processes are running, open your web browser and navigate to:
**http://localhost:5173**

Because the frontend runs with `--host` (configured in `package.json`), you can also access the application from your mobile phone or another computer on the same Wi-Fi network by replacing `localhost` with your computer's local IP address (e.g., `http://192.168.1.X:5173`).
