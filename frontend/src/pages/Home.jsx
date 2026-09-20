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
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-primary/10 via-tertiary/5 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }}></div>
      <div className="absolute -top-32 -left-20 w-[35rem] h-[35rem] rounded-full bg-gradient-to-br from-secondary/10 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      
      {/* Central Focus Stage */}
      <div className={`w-full max-w-4xl flex flex-col transition-all duration-500 ease-in-out relative z-10 ${hasResults ? 'mt-4' : 'mt-12 sm:mt-24'}`}>
        
        {/* Visual Tagline (hides on search) */}
        {!hasResults && (
          <div className="flex flex-col items-start space-y-3 mb-8 w-full">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-on-surface tracking-tight leading-tight">
              Explore<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Curator AI.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant/80 max-w-md font-medium">
              Discover educational roadmaps, personalized playlists, and infinite entertainment.
            </p>
          </div>
        )}
        
        {/* Sleek Search Bar */}
        <div className="w-full relative group shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-surface-container-highest/50 backdrop-blur-md border border-outline-variant/30 focus-within:border-primary/50 focus-within:bg-surface-container-highest">
          <div className="flex flex-col sm:flex-row items-center p-1.5 sm:p-2 w-full">
            <div className="flex items-center flex-1 w-full pl-3 py-2 sm:py-0">
              <span className="material-symbols-outlined text-[24px] text-on-surface-variant mr-3">search</span>
              <input 
                className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 font-medium text-[16px] sm:text-[18px] focus:outline-none antialiased" 
                placeholder="What do you want to listen to?" 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button 
              className="w-full sm:w-auto mt-2 sm:mt-0 flex items-center justify-center gap-2 bg-on-surface text-background font-bold text-[15px] px-6 py-3.5 rounded-xl hover:scale-[0.98] active:scale-95 transition-transform cursor-pointer" 
              type="button"
              onClick={handleGenerate}
            >
              <span>Generate</span>
            </button>
          </div>
        </div>

        {/* AI Capabilities Badge Strip (hides on search) */}
        {!hasResults && (
          <div className="mt-8 flex items-center w-full overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-3">
              {categories.map(cat => (
                <div 
                  key={cat.name}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-medium whitespace-nowrap shadow-sm border border-outline-variant/20"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-[14px]">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Curated Dynamic Presets (hides on search) */}
        {!hasResults && (
          <div className="mt-8 w-full flex flex-col">
            <h3 className="font-bold text-[18px] text-on-surface mb-4">Suggested For You</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              <button 
                className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-left border border-outline-variant/30 group" 
                onClick={() => selectPrompt('Python Backend Development Roadmap')}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">code</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-on-surface">Backend Roadmap</span>
                  <span className="font-medium text-[12px] text-on-surface-variant line-clamp-1">Learn Python & APIs</span>
                </div>
              </button>

              <button 
                className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-left border border-outline-variant/30 group" 
                onClick={() => selectPrompt('Learn Quantum Physics from scratch')}
              >
                <div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">science</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-on-surface">Quantum Physics</span>
                  <span className="font-medium text-[12px] text-on-surface-variant line-clamp-1">From zero to hero</span>
                </div>
              </button>

              <button 
                className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors text-left border border-outline-variant/30 group" 
                onClick={() => selectPrompt('Top 2026 Lo-Fi Focus Beats')}
              >
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">headphones</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-on-surface">Lo-Fi Focus Beats</span>
                  <span className="font-medium text-[12px] text-on-surface-variant line-clamp-1">Study & Chill</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render Studio Results below the search bar */}
      {hasResults && (
        <div className="w-full max-w-[1600px] animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6">
          <Studio />
        </div>
      )}
    </motion.div>
  );

}
