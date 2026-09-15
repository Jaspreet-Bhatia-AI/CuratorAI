import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? 'flex items-center gap-4 px-4 py-3 rounded-xl transition-all bg-primary-container text-on-primary-container font-label-md text-label-md'
      : 'flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-label-md text-label-md';
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex-col justify-between pt-4 pb-6">
      <div className="flex flex-col gap-4">
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 px-6 h-12">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
            Curator AI
          </span>
        </Link>
        
        {/* Active Engine Box */}
        <div className="px-4">
          <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active Engine</span>
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Synthesis v4.2</span>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
          </div>
        </div>
        
        {/* Navigation List */}
        <nav className="flex flex-col gap-1 px-3 mt-2">
          <Link to="/studio" className={getLinkClasses('/studio')}>
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            <span>Studio Grid</span>
          </Link>
          <Link to="/" className={getLinkClasses('/')}>
            <span className="material-symbols-outlined text-[20px]">explore</span>
            <span>Zen Discovery</span>
          </Link>
          <Link to="/library" className={getLinkClasses('/library')}>
            <span className="material-symbols-outlined text-[20px]">video_library</span>
            <span>Offline Vault</span>
          </Link>
          <button onClick={() => window.dispatchEvent(new Event("open-settings"))} className={getLinkClasses('/settings')}>
            <span className="material-symbols-outlined text-[20px]">key</span>
            <span>API & Keys</span>
          </button>
        </nav>
      </div>

      {/* User Status Area */}
      <div className="px-4 flex flex-col gap-3">
        <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors">
          <div className="flex items-center gap-3">
            <img alt="Profile" className="w-8 h-8 rounded-full object-cover bg-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jaspreet" />
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Jaspreet</span>
              <span className="font-label-sm text-label-[10px] text-on-surface-variant uppercase">Pro Plan</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">verified</span>
        </div>
      </div>
    </aside>
  );
}
