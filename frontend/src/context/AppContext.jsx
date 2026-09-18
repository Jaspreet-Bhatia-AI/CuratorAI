import React, { createContext, useContext, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { aiConfig } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Audio Player State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSearch = async (query) => {
    if (!query) return;
    setIsLoading(true);
    setSearchQuery(query);
    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-AI-Provider': aiConfig?.provider || 'groq',
          'X-AI-Key': aiConfig?.key || ''
        },
        body: JSON.stringify({ query: query }),
      });
      if (!res.ok) throw new Error("Failed to fetch roadmap");
      const data = await res.json();
      const payload = data.data || data; setRoadmap(payload);
      setCurriculum(payload.curriculum || []);
      if (payload.roadmap_overview?.length > 0) {
        setSelectedTopic(payload.roadmap_overview[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate content.");
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
