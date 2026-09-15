import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const { user, isDarkMode, toggleTheme } = useAuth();
  const { handleSearch, isLoading } = useAppContext();
  const [query, setQuery] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if(query.trim()) handleSearch(query);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface-container-lowest/80 dark:bg-google-dark/80 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] dark:border-b dark:border-white/10">
      <div className="h-16 w-full px-4 md:px-8 flex items-center justify-between gap-4">
        
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
            C
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface dark:text-white tracking-tight hidden sm:block">Curator</span>
          <span className="bg-secondary-fixed text-on-secondary-fixed-variant dark:bg-google-purple/20 dark:text-google-purple font-label-sm text-label-sm px-2.5 py-0.5 rounded-full hidden lg:block">AI Studio</span>
        </Link>

        {/* Center Search Bar (from Stitch HTML) */}
        <div className="flex-1 max-w-xl mx-auto hidden md:flex items-center" id="tour-search">
          <form onSubmit={onSubmit} className="relative w-full flex items-center bg-surface-container-low dark:bg-surface-container-lowest/10 rounded-xl px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-outline text-[18px] mr-2.5 select-none">search</span>
            <input 
              className="w-full bg-transparent font-body-sm text-body-sm text-on-surface dark:text-white placeholder:text-outline focus:outline-none" 
              placeholder="Search curated streams, video lessons, audio stems..." 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
            <kbd className="ml-2 hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container-lowest dark:bg-black/50 text-outline font-label-sm text-label-sm shadow-[0_1px_4px_rgba(0,0,0,0.04)] select-none">⌘K</kbd>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={toggleTheme} className="p-2 rounded-xl text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-high dark:hover:bg-white/10 transition-colors" type="button">
            <span className="material-symbols-outlined text-[20px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          
          <button className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md px-3.5 py-2 rounded-full shadow-[0_4px_14px_0_rgba(70,72,212,0.25)] hover:bg-primary-container transition-all" type="button">
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Prompt</span>
          </button>
          
          <button className="relative p-2 rounded-xl text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-high dark:hover:bg-white/10 transition-colors hidden sm:block" type="button">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface-container-lowest dark:ring-google-dark"></span>
          </button>
          
          <div className="relative ml-1 flex items-center pl-2">
            {user ? (
              <img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-high dark:ring-white/10" src={user.photoURL} />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-container-high dark:bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-tertiary-container rounded-full ring-2 ring-surface-container-lowest dark:ring-google-dark"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
