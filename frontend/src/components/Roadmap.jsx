import React from 'react';
import { motion } from 'framer-motion';

export default function Roadmap({ roadmap, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-google-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          <div className="h-16 bg-white/5 rounded-xl"></div>
          <div className="h-16 bg-white/5 rounded-xl"></div>
          <div className="h-16 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <div className="bg-google-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-google-purple shadow-[0_0_10px_#bbaaff]"></span>
        {roadmap.title || "Learning Roadmap"}
      </h2>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {roadmap.roadmap_overview && roadmap.roadmap_overview.map((step, index) => {
          // Handle both string arrays and object arrays from the AI output
          const title = typeof step === 'string' ? step : step.main_topic;
          const subtopics = typeof step === 'string' ? [] : (step.sub_topics || []);
          
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative flex items-start group gap-4"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-google-dark text-gray-300 group-hover:text-google-purple group-hover:border-google-purple shadow-[0_0_15px_rgba(187,170,255,0.2)] shrink-0 z-10 transition-colors mt-1">
                {index + 1}
              </div>
              
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-google-purple/50 transition-colors backdrop-blur-md">
                <h3 className="font-medium text-white">{title}</h3>
                {subtopics.length > 0 && (
                  <ul className="text-sm text-gray-400 mt-2 space-y-1 ml-4 list-disc marker:text-google-purple">
                    {subtopics.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
