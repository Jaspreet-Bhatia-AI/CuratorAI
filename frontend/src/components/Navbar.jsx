import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isHome, toggleMobileMenu }) {
  const { searchQuery, setSearchQuery } = useAppContext();
  const location = useLocation();
  const { user, setIsLoginModalOpen, setIsProfileModalOpen, isDarkMode, toggleTheme } = useAuth();

  return (
    <header className={`fixed top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-lg border-b border-outline-variant/30 transition-all duration-300 ${isHome ? 'w-full' : 'left-0 md:left-64 right-0'}`}>
      <div className={`h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4 ${isHome ? 'max-w-7xl mx-auto' : ''}`}>
        
        {/* Left side: Hamburger (Mobile) + Logo */}
        <div className={`flex items-center gap-4 flex-shrink-0 ${!isHome ? 'md:hidden' : ''}`}>
          {!isHome && (
            <button 
              aria-label="Open mobile menu"
              onClick={toggleMobileMenu} 
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="material-symbols-outlined text-[24px]" aria-hidden="true">menu</span>
            </button>
          )}
          <Link to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-full pr-2 group" aria-label="Go to Home" onClick={() => { if(setRoadmap) { setRoadmap(null); setSearchQuery(""); } }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary shadow-sm group-hover:shadow-md transition-all group-hover:scale-105 group-active:scale-95">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">architecture</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight hidden sm:inline-block">
              Curator <span className="text-primary font-bold">AI</span>
            </span>
          </Link>
        </div>

        {/* Center Search */}
        {!isHome ? (
          <div className="flex items-center w-full max-w-md px-4 py-2 rounded-full bg-surface-container/50 border border-outline-variant/30 text-on-surface-variant focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary focus-within:bg-surface-container transition-all" id="tour-search">
            <span className="material-symbols-outlined text-[20px] mr-2 text-primary/70" aria-hidden="true">search</span>
            <input 
              aria-label="Search Roadmap"
              className="bg-transparent flex-1 font-body-sm text-body-sm focus:outline-none text-on-surface w-full min-w-0"
              placeholder="Search Roadmap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface font-mono text-[10px] ml-2 shrink-0 border border-outline-variant/50 shadow-sm" aria-hidden="true">⌘K</kbd>
          </div>
        ) : <div className="flex-1" />}

        {/* Center Nav Links (Hidden on small screens) */}
        <nav className="hidden xl:flex items-center gap-1 bg-surface-container/50 border border-outline-variant/20 p-1 rounded-full backdrop-blur-sm">
          <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined} className={`px-5 py-2.5 font-label-md text-label-md rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary ${location.pathname === '/' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`} onClick={() => { if(setRoadmap) { setRoadmap(null); setSearchQuery(""); } }}>
            Home
          </Link>
          <Link to="/library" aria-current={location.pathname === '/library' ? 'page' : undefined} className={`px-5 py-2.5 font-label-md text-label-md rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary ${location.pathname === '/library' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>
            Library
          </Link>
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} onClick={toggleTheme} className="w-10 h-10 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button onClick={() => window.dispatchEvent(new Event("open-settings"))} aria-label="Settings and API Keys" className="hidden sm:flex w-10 h-10 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary">
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">api</span>
          </button>
          <div className="h-6 w-px bg-outline-variant/50 mx-1 hidden sm:block" aria-hidden="true"></div>
          {user ? (
            <button 
              aria-label="Open Profile Menu"
              onClick={() => setIsProfileModalOpen(true)}
              className="ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest"
            >
              <img 
                alt={`${user.name || 'User'} Profile`} 
                className="w-9 h-9 rounded-full object-cover shadow-sm bg-surface-container-high cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all" 
                src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}&mouth=smile,twinkle`} 
              />
            </button>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 ml-1 rounded-xl bg-primary text-on-primary font-label-md text-label-md shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
