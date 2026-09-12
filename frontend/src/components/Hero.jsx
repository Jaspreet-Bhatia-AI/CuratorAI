import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero({ onSearch, hasSearched, isLoading, progress, loadingStatus }) {
  const [query, setQuery] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if(query.trim() && !isLoading) onSearch(query);
  };

  return (
    <motion.section 
      layout
      className={`flex flex-col items-center justify-center ${hasSearched ? 'py-8' : 'py-32'}`}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div layout className="text-center space-y-6 mb-8 max-w-5xl w-full px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight w-full md:whitespace-nowrap">
          Curate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-purple to-blue-400 drop-shadow-[0_0_15px_rgba(187,170,255,0.4)]">roadmaps & playlists</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
          Enter a topic, artist, or vibe, and let our AI instantly generate the perfect YouTube curriculum or music mix for you.
        </p>
      </motion.div>

      <motion.form 
        layout
        onSubmit={onSubmit}
        className="w-full max-w-2xl relative group flex flex-col items-center"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-google-purple to-blue-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative w-full flex items-center bg-google-surface/60 border border-white/10 backdrop-blur-xl p-2 rounded-[2rem]">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Curating your media..." : "What do you want to learn or listen to today?"}
            className="w-full bg-transparent border-none outline-none text-white px-6 py-4 placeholder-gray-500 text-lg disabled:opacity-50 transition-opacity"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className={`bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6 text-google-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            )}
          </button>
        </div>

        {/* Dynamic Percentage Loading Bar */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="w-full mt-6 px-4"
            >
              <div className="flex justify-between items-center text-sm font-medium text-gray-400 mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-google-purple animate-pulse"></span>
                  {loadingStatus}
                </span>
                <span className="text-google-purple font-mono">{progress}%</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 border border-white/5 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-google-purple to-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(187,170,255,0.5)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut", duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </motion.section>
  );
}
