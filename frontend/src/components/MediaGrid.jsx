import React from 'react';
import { motion } from 'framer-motion';

export default function MediaGrid({ videos, isLoading }) {
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

  return (
    <div className="bg-google-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Curated Content</h2>
        <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-400 border border-white/10">
          {videos.length} Results
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.map((video, i) => (
          <motion.a
            href={video.url}
            target="_blank"
            rel="noreferrer"
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
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
      </div>
    </div>
  );
}
