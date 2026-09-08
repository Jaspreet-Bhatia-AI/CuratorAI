import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MediaGrid({ videos, isLoading, selectedTopic, roadmap }) {
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

  // Smart filtering logic:
  // 1. Find all sub-topics associated with the selected topic from the roadmap
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
        // We will check if the video's topics, rationale, or title contains ANY of the matchWords
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

  return (
    <div className="bg-google-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h2 className="text-2xl font-semibold">
          {selectedTopic ? `Filtered: ${selectedTopic}` : "Curated Content"}
        </h2>
        <div className="flex gap-2">
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
      
      {filteredVideos.length === 0 && selectedTopic && (
        <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl">
          <p>No specific videos found targeting this exact step.</p>
          <p className="text-sm mt-2">Try selecting another step or viewing all videos.</p>
        </div>
      )}

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredVideos.map((video, i) => (
            <motion.a
              href={video.url}
              target="_blank"
              rel="noreferrer"
              key={video.url || i}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-google-purple/50 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <img 
                  src={video.thumbnail || "https://via.placeholder.com/640x360?text=No+Thumbnail"} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white z-20">
                  {video.duration ? `${Math.floor(video.duration/60)}:${(video.duration%60).toString().padStart(2, '0')}` : 'Video'}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-medium text-gray-100 line-clamp-2 mb-2 group-hover:text-google-purple transition-colors">
                  {video.title}
                </h3>
                
                {video.rationale && (
                  <div className="mt-auto bg-google-purple/10 border border-google-purple/20 p-2 rounded text-xs text-google-purple/90">
                    💡 {video.rationale}
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
