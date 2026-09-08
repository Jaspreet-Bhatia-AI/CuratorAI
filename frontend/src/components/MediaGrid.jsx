import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MediaGrid({ videos, isLoading, selectedTopic, roadmap }) {
  const [selectedUrls, setSelectedUrls] = useState([]);

  if (isLoading && videos.length === 0) {
    return (
      <div className="bg-google-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
        <h2 className="text-2xl font-semibold mb-6">Curating Content...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1,2,3,4].map(v => (
            <div key={v} className="aspect-video bg-white/5 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) return null;

  let matchWords = [];
  if (selectedTopic) {
    matchWords.push(selectedTopic.toLowerCase());
    
    if (roadmap && roadmap.roadmap_overview) {
      const stepObj = roadmap.roadmap_overview.find(s => 
        (typeof s === 'string' ? s : s.main_topic) === selectedTopic
      );
      if (stepObj && stepObj.sub_topics) {
        stepObj.sub_topics.forEach(sub => matchWords.push(sub.toLowerCase()));
      }
    }
  }

  const filteredVideos = selectedTopic 
    ? videos.filter(v => {
        const searchSpace = [
          ...(v.topics || []),
          v.title || "",
          v.rationale || ""
        ].map(s => s.toLowerCase());

        return matchWords.some(matchWord => 
          searchSpace.some(targetText => 
            targetText.includes(matchWord) || matchWord.includes(targetText)
          )
        );
      })
    : videos;

  // Selection Logic
  const allFilteredUrls = filteredVideos.map(v => v.url);
  const isAllSelected = allFilteredUrls.length > 0 && allFilteredUrls.every(url => selectedUrls.includes(url));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUrls(prev => prev.filter(url => !allFilteredUrls.includes(url)));
    } else {
      const newUrls = [...selectedUrls];
      allFilteredUrls.forEach(url => {
        if (!newUrls.includes(url)) newUrls.push(url);
      });
      setSelectedUrls(newUrls);
    }
  };

  const toggleSelect = (url, e) => {
    e.stopPropagation();
    setSelectedUrls(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleDownload = () => {
    if (selectedUrls.length === 0) return;
    alert(`Initiating backend download for ${selectedUrls.length} videos...`);
    // Here we will wire the websocket connection to the backend later!
  };

  return (
    <div className="bg-google-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            {selectedTopic ? `Filtered: ${selectedTopic}` : "Curated Content"}
          </h2>
          <div className="flex gap-2 mt-2">
            {selectedTopic && (
              <span className="text-xs bg-google-purple/20 text-google-purple border border-google-purple/30 px-3 py-1 rounded-full flex items-center">
                Filter Active
              </span>
            )}
            <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-400 border border-white/10 flex items-center">
              {filteredVideos.length} Results
            </span>
          </div>
        </div>
        
        {filteredVideos.length > 0 && (
          <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer px-2">
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded bg-white/10 border-white/20 text-google-purple focus:ring-google-purple accent-google-purple cursor-pointer"
              />
              Select All
            </label>
            <button 
              onClick={handleDownload}
              disabled={selectedUrls.length === 0}
              className="bg-gradient-to-r from-google-purple to-blue-500 hover:from-google-purple/80 hover:to-blue-600/80 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(187,170,255,0.3)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download ({selectedUrls.length})
            </button>
          </div>
        )}
      </div>
      
      {filteredVideos.length === 0 && selectedTopic && (
        <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl">
          <p>No specific videos found targeting this exact step.</p>
          <p className="text-sm mt-2">Try selecting another step or viewing all videos.</p>
        </div>
      )}

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative">
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video) => {
            const isSelected = selectedUrls.includes(video.url);
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, type: "spring" }}
                key={video.url}
                onClick={(e) => toggleSelect(video.url, e)}
                className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col border ${isSelected ? 'bg-google-purple/10 border-google-purple shadow-[0_0_20px_rgba(187,170,255,0.2)]' : 'bg-white/5 border-white/10 hover:border-google-purple/50'}`}
              >
                {/* Selection Checkbox (Top Left) */}
                <div className="absolute top-3 left-3 z-30">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => toggleSelect(video.url, e)}
                    className="w-5 h-5 rounded bg-black/50 border-white/20 text-google-purple focus:ring-google-purple accent-google-purple cursor-pointer shadow-xl"
                  />
                </div>

                <div className="relative aspect-video w-full overflow-hidden">
                  <img 
                    src={video.thumbnail || "https://via.placeholder.com/640x360?text=No+Thumbnail"} 
                    alt={video.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                  
                  {/* External Link Button */}
                  <a 
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-google-purple/80 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>

                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white z-20 font-mono">
                    {video.duration ? `${Math.floor(video.duration/60)}:${(video.duration%60).toString().padStart(2, '0')}` : 'Video'}
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className={`text-sm font-medium line-clamp-2 mb-2 transition-colors ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-google-purple'}`}>
                    {video.title}
                  </h3>
                  
                  {video.rationale && (
                    <div className="mt-auto bg-google-purple/10 border border-google-purple/20 p-2 rounded text-xs text-google-purple/90">
                      💡 {video.rationale}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
