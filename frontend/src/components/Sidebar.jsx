import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, closeMenu }) {
  const { user, setIsLoginModalOpen, setIsProfileModalOpen } = useAuth();
  const location = useLocation();

  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? 'flex items-center gap-4 px-4 py-3 rounded-xl transition-all bg-primary-container text-on-primary-container font-label-md text-label-md'
      : 'flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-label-md text-label-md';
  };

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex-col justify-between pt-4 pb-6 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 flex' : '-translate-x-full md:translate-x-0 hidden md:flex'}`}>
      <div className="flex flex-col gap-4">
        {/* Logo Area */}
        <div className="flex items-center justify-between px-6 h-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
              Curator AI
            </span>
          </Link>
          <button onClick={closeMenu} className="md:hidden text-on-surface-variant p-1 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Active Engine Box */}
        <div className="px-4">
          <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Active Engine</span>
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Curator Engine</span>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
          </div>
        </div>
        
        {/* Navigation List */}
        <nav className="flex flex-col gap-1 px-3 mt-2">
          <Link to="/" className={getLinkClasses('/')}>
            <span className="material-symbols-outlined text-[20px]">explore</span>
            <span>Home</span>
          </Link>
          <Link to="/library" className={getLinkClasses('/library')}>
            <span className="material-symbols-outlined text-[20px]">video_library</span>
            <span>Library</span>
          </Link>
          <button onClick={() => window.dispatchEvent(new Event("open-settings"))} className={getLinkClasses('/settings')}>
            <span className="material-symbols-outlined text-[20px]">api</span>
            <span>API & Keys</span>
          </button>
        </nav>
      </div>

      {/* User Status Area */}
      <div className="px-4 flex flex-col gap-3">
        {user ? (
          <div onClick={() => setIsProfileModalOpen(true)} className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between shadow-sm cursor-pointer hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-3">
              <img alt="Profile" className="w-8 h-8 rounded-full object-cover bg-white" src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}&mouth=smile,twinkle`} />
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">{user.name}</span>
                <span className="font-label-sm text-label-[10px] text-on-surface-variant uppercase">Pro Plan</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">verified</span>
          </div>
        ) : (
          <div onClick={() => setIsLoginModalOpen(true)} className="p-4 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm cursor-pointer hover:opacity-90 transition-opacity gap-2 font-label-md">
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>Sign In to Sync</span>
          </div>
        )}
      </div>
    </aside>
  );
}
