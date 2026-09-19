import React, { createContext, useContext, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { load } from '@tauri-apps/plugin-store';
import { supabase } from '../utils/supabase';

const AppContext = createContext();


export function AppProvider({ children }) {
  const { user, aiConfig } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingQuery, setPendingQuery] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSearch = async (query) => {
    if (!query) return;

// BYOK Key Check Interceptor
    let geminiKey = localStorage.getItem('gemini_key');
    let groqKey = localStorage.getItem('groq_key');
    try {
      const store = await load('settings.json', { autoSave: true });
      geminiKey = await store.get('gemini_key') || geminiKey;
      groqKey = await store.get('groq_key') || groqKey;
    } catch (e) {}
    
    if (!geminiKey && !groqKey) {
      setPendingQuery(query);
      toast.error("Please configure your API Key first.");
      window.dispatchEvent(new Event('open-settings'));
      return;
    }
    setIsLoading(true);
    setRoadmap(null);
    setSearchQuery(query);

    try {
      const { data: cachedData } = await supabase
        .from('queries_cache')
        .select('json_data')
        .eq('query_text', query.toLowerCase())
        .single();
        
      let payload;

      if (cachedData && cachedData.json_data) {
        payload = cachedData.json_data;
      } else {
        // Safely use the awaited keys from the Tauri store
        const activeGroq = groqKey;
        const activeGemini = geminiKey;
        const finalProvider = activeGroq ? 'groq' : 'gemini';
        const finalKey = activeGroq || activeGemini || '';

        const res = await fetch('/api/generate-roadmap', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-AI-Provider': finalProvider,
            'X-AI-Key': finalKey.trim()
          },
          body: JSON.stringify({ query: query, user_email: user?.email || null }),
        });
        if (!res.ok) {
          let errStr = "Failed to fetch roadmap";
          try {
            const errData = await res.json();
            errStr = errData.detail || errStr;
          } catch (e) {}
          throw new Error(errStr);
        }

        const data = await res.json();
        payload = data.data || data; 
        
        // Save to cache
        await supabase
          .from('queries_cache')
          .insert([{ query_text: query.toLowerCase(), json_data: payload }]);
      }
      
      if (user?.email) {
        await supabase
          .from('user_history')
          .insert([{ 
             user_email: user.email, 
             query: query, 
             roadmap: payload 
          }]);
      }

      setRoadmap(payload);
      setCurriculum(payload.curriculum || []);
      if (payload.roadmap_overview?.length > 0) {
        setSelectedTopic(payload.roadmap_overview[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to generate content.");
    }
    setIsLoading(false);
  };

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <AppContext.Provider value={{
      searchQuery, setSearchQuery,
      pendingQuery, setPendingQuery,
      roadmap, curriculum, setCurriculum,
      isLoading, selectedTopic, setSelectedTopic,
      handleSearch,
      currentTrack, isPlaying, playTrack, togglePlay, setIsPlaying
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
