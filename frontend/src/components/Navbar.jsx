import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isHome, toggleMobileMenu }) {
  const { searchQuery, setSearchQuery } = useAppContext();
  const location = useLocation();
  const { user, setIsLoginModalOpen, setIsProfileModalOpen, isDarkMode, toggleTheme } = useAuth();

  return (
    <header className={`fixed top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all ${isHome ? 'w-full' : 'left-0 md:left-64 right-0'}`}>
      <div className={`h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4 ${isHome ? 'lg:px-12' : ''}`}>
        
        {/* Left side: Hamburger (Mobile) + Logo */}
        <div className={`flex items-center gap-4 flex-shrink-0 ${!isHome ? 'md:hidden' : ''}`}>
          {!isHome && (
            <button 
              onClick={toggleMobileMenu} 
              className="p-1 -ml-2 rounded-full text-on-surface hover:bg-surface-container transition-colors md:hidden"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          )}
          <Link to="/" className="flex items-center gap-3" onClick={() => { if(setRoadmap) { setRoadmap(null); setSearchQuery(""); } }}>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight hidden sm:inline-block">
              Curator AI
            </span>
          </Link>
        </div>

        {/* Center Search */}
        {!isHome ? (
          <div className="flex items-center w-full max-w-md px-4 py-1 rounded-full bg-surface-container-low text-on-surface-variant shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]" id="tour-search">
            <span className="material-symbols-outlined text-[18px] mr-2">search</span>
            <input 
              className="bg-transparent flex-1 font-body-sm text-body-sm focus:outline-none text-on-surface w-full min-w-0"
              placeholder="Search Roadmap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface font-label-sm text-[10px] shadow-sm ml-2 shrink-0">⌘K</kbd>
          </div>
        ) : <div className="flex-1" />}

        {/* Center Nav Links (Hidden on small screens) */}
        <nav className="hidden xl:flex items-center gap-1 bg-surface-container-low p-1 rounded-full">
          <Link to="/" className={`px-4 py-1 font-label-md text-label-md rounded-full transition-all ${location.pathname === '/' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`} onClick={() => { if(setRoadmap) { setRoadmap(null); setSearchQuery(""); } }}>
            Home
          </Link>
          <Link to="/library" className={`px-4 py-1 font-label-md text-label-md rounded-full transition-all ${location.pathname === '/library' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>
            Library
          </Link>
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button aria-label="Toggle Dark Mode" onClick={toggleTheme} className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={() => window.dispatchEvent(new Event("open-settings"))} aria-label="Settings and API Keys" className="hidden sm:flex p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">api</span>
          </button>
          <div className="h-5 w-px bg-outline-variant mx-1 hidden sm:block"></div>
          {user ? (
            <img 
              onClick={() => setIsProfileModalOpen(true)}
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.08)] bg-surface-container-high cursor-pointer hover:ring-2 hover:ring-primary transition-all ml-1" 
              src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}&mouth=smile,twinkle`} 
            />
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
