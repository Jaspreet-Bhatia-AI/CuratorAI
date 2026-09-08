import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Hero({ onSearch, hasSearched }) {
  const [query, setQuery] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if(query.trim()) onSearch(query);
  };

  return (
    <motion.section 
      layout
      className={`flex flex-col items-center justify-center ${hasSearched ? 'py-8' : 'py-32'}`}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div layout className="text-center space-y-6 mb-8 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Design your <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-purple to-blue-400 drop-shadow-[0_0_15px_rgba(187,170,255,0.4)]">learning path</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
          Enter a topic and let our AI curate the perfect YouTube roadmap for you.
        </p>
      </motion.div>

      <motion.form 
        layout
        onSubmit={onSubmit}
        className="w-full max-w-2xl relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-google-purple to-blue-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-google-surface/60 border border-white/10 backdrop-blur-xl p-2 rounded-[2rem]">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to learn today?"
            className="w-full bg-transparent border-none outline-none text-white px-6 py-4 placeholder-gray-500 text-lg"
          />
          <button 
            type="submit"
            className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </motion.form>
    </motion.section>
  );
}
