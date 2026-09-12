import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';


const VideoCard3D = ({ video, isSelected, onToggleSelect, progress }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, type: "spring" }}
      style={{ perspective: 1200 }}
      className="h-full"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => onToggleSelect(video.url, e)}
        className={`group relative rounded-xl h-full overflow-hidden cursor-pointer transition-colors duration-300 flex flex-col border ${
          isSelected 
            ? 'bg-green-900/30 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-1 ring-green-500/50' 
            : 'bg-white/5 border-white/10 hover:border-white/30'
        }`}
      >
        <div className="absolute top-4 left-4 z-30" style={{ transform: "translateZ(50px)" }}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
            isSelected 
              ? 'bg-green-500 scale-110 shadow-[0_0_15px_rgba(34,197,94,0.6)]' 
              : 'bg-black/60 border-2 border-white/30 group-hover:border-white/60'
          }`}>
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>

        <div className="relative aspect-video w-full overflow-hidden" style={{ transform: "translateZ(20px)" }}>
          <img 
            src={video.thumbnail || "https://via.placeholder.com/640x360?text=No+Thumbnail"} 
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105 opacity-90' : 'group-hover:scale-110 opacity-100'}`}
          />
          <div className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-green-900/40 mix-blend-overlay' : 'bg-gradient-to-t from-black/90 via-black/20 to-transparent'}`}></div>
          
          <a 
            href={video.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-green-500 text-white p-2 rounded-full backdrop-blur-md transition-colors"
            title="Watch on YouTube"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>

          <div className="absolute bottom-2 right-2 bg-black/80 text-xs font-semibold px-2 py-1 rounded">
            {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "Vid"}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
          <h3 className="font-semibold text-sm line-clamp-2 leading-snug group-hover:text-green-300 transition-colors mb-2">
            {video.title}
          </h3>
          
          <div className="text-xs text-gray-400 mb-4 flex items-center space-x-2">
            <span>{video.views ? new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(video.views) : '---'} views</span>
            {video.topics && video.topics.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="truncate text-green-400/80">{video.topics[0]}</span>
              </>
            )}
          </div>

          {progress && (
            <div className="mt-auto mb-2" style={{ transform: "translateZ(40px)" }}>
              <div className="flex justify-between text-xs mb-1 text-green-300 font-medium">
                <span>{progress.label}</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 border border-white/10 overflow-hidden">
                <motion.div 
                  className="bg-green-500 h-1.5 shadow-[0_0_10px_rgba(34,197,94,0.8)]" 
                  initial={{ width: '0%' }}
                  animate={{ width: progress.percent }}
                  transition={{ ease: "linear", duration: 0.5 }}
                />
              </div>
            </div>
          )}
          
          {video.rationale && !progress && (
            <div className={`mt-auto p-2 rounded text-xs transition-colors ${
              isSelected 
                ? 'bg-green-500/20 border border-green-500/30 text-green-200' 
                : 'bg-white/5 border border-white/10 text-gray-400'
            }`}>
              💡 {video.rationale}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function MediaGrid({ videos, isLoading, selectedTopic, roadmap }) {
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [downloadFormat, setDownloadFormat] = useState("video_high");
  const [progresses, setProgresses] = useState({});

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

  // Deduplicate videos: if multiple steps return the same video, merge them!
  const uniqueVideosMap = new Map();
  videos.forEach(v => {
    if (uniqueVideosMap.has(v.url)) {
      const existing = uniqueVideosMap.get(v.url);
      
      // Merge topics without duplicates
      const combinedTopics = Array.from(new Set([...(existing.topics || []), ...(v.topics || [])]));
      
      // Merge rationales if they are different
      let combinedRationale = existing.rationale;
      if (v.rationale && existing.rationale && existing.rationale !== v.rationale) {
        // If it's getting too long, we might just keep the first one, 
        // but merging them with a bullet point or pipe is good
        if (!existing.rationale.includes(v.rationale)) {
           combinedRationale = `${existing.rationale} • ${v.rationale}`;
        }
      }

      uniqueVideosMap.set(v.url, { 
        ...existing, 
        topics: combinedTopics, 
        rationale: combinedRationale 
      });
    } else {
      uniqueVideosMap.set(v.url, { ...v });
    }
  });
  
  const uniqueVideos = Array.from(uniqueVideosMap.values());

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

  // Filter based on the DEDUPLICATED videos
  const filteredVideos = selectedTopic 
    ? uniqueVideos.filter(v => {
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
    : uniqueVideos;

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
    if (e) e.stopPropagation();
    setSelectedUrls(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleDownload = () => {
    if (selectedUrls.length === 0) return;
    
    selectedUrls.forEach((url, index) => {
      setTimeout(() => {
        const taskId = Math.random().toString(36).substring(7);
        
        setProgresses(prev => ({ 
          ...prev, 
          [url]: { percent: '0%', status: 'fetching', label: 'Connecting...' } 
        }));
        
        const interval = setInterval(async () => {
          try {
            const res = await fetch(`/api/progress?task_id=${taskId}`);
            const data = await res.json();
            
            if (data.status !== 'waiting') {
              setProgresses(prev => ({
                ...prev,
                [url]: { 
                  percent: data.percent, 
                  status: data.status,
                  label: data.status === 'processing' ? 'Finalizing (Server to Browser)...' : `Downloading ${data.percent}`
                }
              }));
              
              if (data.status === 'processing') {
                clearInterval(interval);
              }
            }
          } catch (e) {
            // ignore network errors during poll
          }
        }, 1000);

        const link = document.createElement("a");
        link.href = `/api/download?url=${encodeURIComponent(url)}&format=${downloadFormat}&task_id=${taskId}`;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 1000);
    });
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
            {/* Custom Select All Checkbox */}
            <div 
              onClick={toggleSelectAll} 
              className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer px-2 hover:text-white transition-colors group"
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${isAllSelected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-black/50 border border-white/30 group-hover:border-white/60'}`}>
                {isAllSelected && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-medium">Select All</span>
            </div>

            
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className="bg-black/50 border border-white/20 text-white text-sm rounded-lg py-2 px-3 focus:outline-none focus:border-green-500 transition-colors cursor-pointer"
            >
              <option value="video_high">Video (1080p+ Slower)</option>
              <option value="video_fast">Video (720p Lightning Fast)</option>
              <option value="audio">Audio (MP3)</option>
            </select>
            <button 
              onClick={handleDownload}
              disabled={selectedUrls.length === 0}
              className={`font-medium py-2 px-4 rounded-lg transition-all text-sm flex items-center gap-2 ${
                selectedUrls.length > 0 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]' 
                  : 'bg-white/5 text-gray-500 opacity-50 cursor-not-allowed border border-white/10'
              }`}
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
              <VideoCard3D 
              key={video.url} 
              video={video} 
              isSelected={isSelected} 
              onToggleSelect={toggleSelect} 
              progress={progresses[video.url]} 
            />
          );
        })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
