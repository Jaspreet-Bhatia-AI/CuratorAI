import React from 'react';
import { motion } from 'framer-motion';

const videos = [1, 2, 3, 4];

export default function MediaGrid() {
  return (
    <div className="bg-google-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Curated Content</h2>
        <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-400 border border-white/10">
          AI Generated
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((v, i) => (
          <motion.div
            key={v}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 }}
            className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-video cursor-pointer hover:border-google-purple/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 group-hover:bg-google-purple transition-colors">
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <h3 className="text-sm font-medium text-gray-200 line-clamp-1">Module {v}: Deep Dive into Core Concepts</h3>
              <p className="text-xs text-gray-400 mt-1">12:34 • YouTube</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
