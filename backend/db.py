import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "history.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Table to store history for users
    c.execute('''
        CREATE TABLE IF NOT EXISTS user_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT,
            query TEXT,
            roadmap_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Table to store youtube metadata cache globally
    c.execute('''
        CREATE TABLE IF NOT EXISTS global_video_cache (
            url TEXT PRIMARY KEY,
            metadata_json TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_user_history(email, query, roadmap_data):
    if not email:
        email = "anonymous"
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO user_history (user_email, query, roadmap_json) VALUES (?, ?, ?)",
        (email, query, json.dumps(roadmap_data))
    )
    conn.commit()
    conn.close()

def get_user_history(email):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "SELECT query, roadmap_json, created_at FROM user_history WHERE user_email = ? ORDER BY created_at DESC",
        (email,)
    )
    rows = c.fetchall()
    conn.close()
    
    history = []
    for row in rows:
        history.append({
            "query": row[0],
            "roadmap": json.loads(row[1]),
            "created_at": row[2]
        })
    return history

# Initialize on import
init_db()
