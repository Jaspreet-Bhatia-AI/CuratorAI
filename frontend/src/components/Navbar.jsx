import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Navbar({ isZen }) {
  const { searchQuery, setSearchQuery } = useAppContext();
  const location = useLocation();

  return (
    <header className={`fixed top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all ${isZen ? 'w-full' : 'left-0 md:left-64 right-0'}`}>
      <div className={`h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4 ${isZen ? 'lg:px-12' : ''}`}>
        
        {/* Left side: Logo only if Zen, otherwise hidden on md+ because sidebar has logo */}
        <div className={`flex items-center gap-4 flex-shrink-0 ${!isZen ? 'md:hidden' : ''}`}>
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight hidden sm:inline-block">
            Curator AI
          </span>
        </div>

        {/* Center Search (Hidden on Zen because it's massive in the middle of the screen) */}
        {!isZen ? (
          <div className="flex items-center w-full max-w-md px-4 py-1 rounded-full bg-surface-container-low text-on-surface-variant shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]" id="tour-search">
            <span className="material-symbols-outlined text-[18px] mr-2">search</span>
            <input 
              className="bg-transparent flex-1 font-body-sm text-body-sm focus:outline-none text-on-surface"
              placeholder="Search Studio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface font-label-sm text-[10px] shadow-sm ml-2">⌘K</kbd>
          </div>
        ) : <div className="flex-1" />}

        {/* Center Nav Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-surface-container-low p-1 rounded-full">
          <Link to="/" className={`px-4 py-1 font-label-md text-label-md rounded-full transition-all ${location.pathname === '/' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>
            Zen
          </Link>
          <Link to="/studio" className={`px-4 py-1 font-label-md text-label-md rounded-full transition-all ${location.pathname === '/studio' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>
            Studio
          </Link>
          <Link to="/library" className={`px-4 py-1 font-label-md text-label-md rounded-full transition-all ${location.pathname === '/library' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>
            Library
          </Link>
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button aria-label="Toggle Dark Mode" className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">dark_mode</span>
          </button>
          <button onClick={() => window.dispatchEvent(new Event("open-settings"))} aria-label="Settings and API Keys" className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div className="h-5 w-px bg-outline-variant mx-1 hidden sm:block"></div>
          <img alt="Profile" className="w-8 h-8 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-surface-container-high" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jaspreet" />
        </div>

      </div>
    </header>
  );
}
