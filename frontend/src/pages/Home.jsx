import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import Roadmap from '../components/Roadmap';
import MediaGrid from '../components/MediaGrid';

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');
  
  const [roadmap, setRoadmap] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleSearch = async (query) => {
    setHasSearched(true);
    setIsLoading(true);
    setProgress(5);
    setLoadingStatus("Connecting to AI Core...");
    setRoadmap(null);
    setVideos([]);
    setSelectedTopic(null);

    // Simulate progress for the Groq AI phase (up to 40%)
    const aiInterval = setInterval(() => {
      setProgress(p => {
        if (p < 40) return p + Math.floor(Math.random() * 5);
        return p;
      });
      setLoadingStatus("Architecting learning curriculum...");
    }, 600);

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      
      clearInterval(aiInterval);
      const data = await res.json();
      
      if(data.success && data.data) {
        setProgress(45);
        setRoadmap(data.data);
        
        const curriculum = data.data.curriculum || [];
        const totalVideos = curriculum.length;
        let completedVideos = 0;
        
        setLoadingStatus(`Finding perfect video matches (0/${totalVideos})...`);
        
        if (totalVideos === 0) {
          setProgress(100);
          setIsLoading(false);
          return;
        }

        // Fetch videos in parallel, updating progress as each one finishes
        const promises = curriculum.map(async (item) => {
          try {
            const r = await fetch("/api/search", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ search_query: item.search_query })
            });
            const vData = await r.json();
            
            if(vData.success) {
              setVideos(prev => [...prev, { 
                ...vData.data, 
                rationale: item.rationale,
                topics: item.topics_covered 
              }]);
            }
          } catch (e) {
            console.error("Search failed for:", item.search_query, e);
          } finally {
            completedVideos++;
            // Calculate progress from 45% to 100%
            const currentProgress = Math.floor(45 + (completedVideos / totalVideos) * 55);
            setProgress(currentProgress > 100 ? 100 : currentProgress);
            setLoadingStatus(`Curating videos (${completedVideos}/${totalVideos})...`);
          }
        });

        await Promise.all(promises);
        
        setProgress(100);
        setLoadingStatus("Curation Complete!");
        
        // Brief delay so the user can see 100% before it hides
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
        
      } else {
        clearInterval(aiInterval);
        setIsLoading(false);
      }
    } catch (err) {
      clearInterval(aiInterval);
      console.error("Backend connection failed:", err);
      alert("Failed to connect to backend. Is FastAPI running?");
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-32 space-y-16"
    >
      <Hero 
        onSearch={handleSearch} 
        hasSearched={hasSearched} 
        isLoading={isLoading} 
        progress={progress}
        loadingStatus={loadingStatus}
      />
      
      {hasSearched && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-1">
            <Roadmap 
              roadmap={roadmap} 
              isLoading={isLoading} 
              selectedTopic={selectedTopic}
              onSelectTopic={setSelectedTopic}
            />
          </div>
          <div className="lg:col-span-2">
            <MediaGrid 
              roadmap={roadmap}
              videos={videos} 
              isLoading={isLoading} 
              selectedTopic={selectedTopic}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
