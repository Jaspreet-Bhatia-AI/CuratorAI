import { createClient } from '@supabase/supabase-js';
import { load } from '@tauri-apps/plugin-store';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

const tauriStorage = {
  getItem: async (key) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        const store = await load('auth.json', { autoSave: true });
        return (await store.get(key)) || null;
      }
    } catch (e) {}
    return localStorage.getItem(key);
  },
  setItem: async (key, value) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        const store = await load('auth.json', { autoSave: true });
        await store.set(key, value);
        await store.save();
        return;
      }
    } catch (e) {}
    localStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        const store = await load('auth.json', { autoSave: true });
        await store.delete(key);
        await store.save();
        return;
      }
    } catch (e) {}
    localStorage.removeItem(key);
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: tauriStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
});
