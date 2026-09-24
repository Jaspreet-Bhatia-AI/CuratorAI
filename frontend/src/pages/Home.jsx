import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Studio from './Studio';
import { motion } from "framer-motion";

export default function Home() {
  const { searchQuery, setSearchQuery, handleSearch, roadmap, isLoading } = useAppContext();
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
      
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const selectPrompt = (promptText) => {
    setSearchQuery(promptText);
    handleSearch(promptText);
    
  };

  const categories = [
    { name: 'Learning', icon: '📚' },
    { name: 'Music', icon: '🎵' },
    { name: 'Entertainment', icon: '🍿' },
    { name: 'Everything Else', icon: '✨' }
  ];

const hasResults = roadmap || isLoading;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex flex-col w-full min-h-[calc(100vh-4rem)] items-center relative overflow-x-hidden px-4 sm:px-6 lg:px-12 select-none pb-32 bg-background">
      
      {/* Intense Ambient Background Orbs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-primary/20 via-tertiary/10 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="absolute -top-32 -left-20 w-[35rem] h-[35rem] rounded-full bg-gradient-to-br from-secondary/20 via-primary/10 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      
      {/* Central Focus Stage */}
      <div className={`w-full max-w-4xl flex flex-col transition-all duration-500 ease-in-out relative z-10 ${hasResults ? 'mt-4' : 'mt-16 sm:mt-28'}`}>
        
        {/* Visual Tagline (hides on search) */}
        {!hasResults && (
          <div className="flex flex-col items-center text-center space-y-4 mb-10 w-full">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-on-surface tracking-tight leading-tight">
              Curate your <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary drop-shadow-sm">
                perfect path
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-on-surface-variant max-w-2xl font-medium">
              Discover educational roadmaps, personalized playlists, and infinite entertainment curated just for you.
            </p>
          </div>
        )}
        
        {/* Sleek Search Bar */}
        <div className={`w-full relative group shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-surface-container-highest/60 backdrop-blur-xl border border-outline-variant/40 focus-within:border-primary/50 focus-within:bg-surface-container-highest focus-within:shadow-lg focus-within:shadow-primary/5 ${!hasResults ? 'max-w-3xl mx-auto' : ''}`}>
          <div className="flex flex-col sm:flex-row items-center p-2 sm:p-3 w-full gap-2">
            <div className="flex items-center flex-1 w-full px-3 py-2 sm:py-0">
              <span className="material-symbols-outlined text-[28px] text-primary/80 mr-3">search</span>
              <input 
                className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 font-medium text-[16px] sm:text-[18px] focus:outline-none antialiased" 
                placeholder="What do you want to learn or listen to today?" 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-[16px] px-8 py-3.5 rounded-xl shadow-md hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background" 
              type="button"
              onClick={handleGenerate}
            >
              <span>Generate</span>
            </button>
          </div>
        </div>

        {/* AI Capabilities Badge Strip (hides on search) */}
        {!hasResults && (
          <div className="mt-10 flex items-center justify-center w-full overflow-x-auto no-scrollbar pb-4 px-4 sm:px-0">
            <div className="flex gap-4">
              {categories.map(cat => (
                <div 
                  key={cat.name}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface font-medium whitespace-nowrap shadow-sm border border-outline-variant/30 cursor-default"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[15px]">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Curated Dynamic Presets (hides on search) */}
        {!hasResults && (
          <div className="mt-12 w-full flex flex-col max-w-3xl mx-auto">
            <h3 className="font-semibold text-[20px] text-on-surface mb-5 text-center">Suggested For You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              <button 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left border border-outline-variant/40 group focus:outline-none focus:ring-2 focus:ring-primary" 
                onClick={() => selectPrompt('Python Backend Development Roadmap')}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">code</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] text-on-surface mb-0.5">Backend Roadmap</span>
                  <span className="font-medium text-[13px] text-on-surface-variant line-clamp-2">Learn Python & APIs</span>
                </div>
              </button>

              <button 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left border border-outline-variant/40 group focus:outline-none focus:ring-2 focus:ring-primary" 
                onClick={() => selectPrompt('Learn Quantum Physics from scratch')}
              >
                <div className="w-12 h-12 rounded-2xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">science</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] text-on-surface mb-0.5">Quantum Physics</span>
                  <span className="font-medium text-[13px] text-on-surface-variant line-clamp-2">From zero to hero</span>
                </div>
              </button>

              <button 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left border border-outline-variant/40 group focus:outline-none focus:ring-2 focus:ring-primary" 
                onClick={() => selectPrompt('Top 2026 Lo-Fi Focus Beats')}
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">headphones</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] text-on-surface mb-0.5">Lo-Fi Focus Beats</span>
                  <span className="font-medium text-[13px] text-on-surface-variant line-clamp-2">Study & Chill</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render Studio Results below the search bar */}
      {hasResults && (
        <div className="w-full max-w-[1600px] animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
          <Studio />
        </div>
      )}
    </motion.div>
  );

}

