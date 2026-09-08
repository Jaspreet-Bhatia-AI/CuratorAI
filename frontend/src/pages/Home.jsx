import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Roadmap from '../components/Roadmap';
import MediaGrid from '../components/MediaGrid';

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleSearch = async (query) => {
    setHasSearched(true);
    setIsLoading(true);
    setRoadmap(null);
    setVideos([]);
    setSelectedTopic(null);

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      
      const data = await res.json();
      
      if(data.success && data.data) {
        setRoadmap(data.data);
        
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
      alert("Failed to connect to backend. Is FastAPI running?");
    }
    
    setIsLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-6 py-32 space-y-16"
    >
      <Hero onSearch={handleSearch} hasSearched={hasSearched} isLoading={isLoading} />
      
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
