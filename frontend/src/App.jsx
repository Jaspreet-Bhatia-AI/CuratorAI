import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import Roadmap from './components/Roadmap';
import MediaGrid from './components/MediaGrid';
import './index.css';

function App() {
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [videos, setVideos] = useState([]);

  const handleSearch = async (query) => {
    setHasSearched(true);
    setIsLoading(true);
    setRoadmap(null);
    setVideos([]);

    try {
      // 1. Call FastAPI backend for the AI Roadmap
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      
      const data = await res.json();
      
      if(data.success && data.data) {
        setRoadmap(data.data);
        
        // 2. Search for the videos one by one
        const curriculum = data.data.curriculum || [];
        for(const item of curriculum) {
          fetch("/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ search_query: item.search_query })
          })
          .then(r => r.json())
          .then(vData => {
            if(vData.success) {
              setVideos(prev => [...prev, { 
                ...vData.data, 
                rationale: item.rationale,
                topics: item.topics_covered 
              }]);
            }
          })
          .catch(e => console.error("Search failed:", e));
        }
      }
    } catch (err) {
      console.error("Backend connection failed:", err);
      alert("Failed to connect to backend. Is FastAPI running on port 8000?");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl space-y-12"
      >
        <header className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-google-purple to-blue-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
            <span className="font-semibold text-xl tracking-tight">Curator<span className="text-google-purple">AI</span></span>
          </div>
        </header>

        <main className="space-y-16">
          <Hero onSearch={handleSearch} hasSearched={hasSearched} isLoading={isLoading} />
          
          {hasSearched && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-1">
                <Roadmap roadmap={roadmap} isLoading={isLoading} />
              </div>
              <div className="lg:col-span-2">
                <MediaGrid videos={videos} isLoading={isLoading} />
              </div>
            </motion.div>
          )}
        </main>
      </motion.div>
    </div>
  );
}

export default App;
