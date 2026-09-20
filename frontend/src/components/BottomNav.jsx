import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav({ user, openAuthModal, openProfileModal }) {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Search', path: '/search', icon: 'search' },
    { name: 'Library', path: '/library', icon: 'library_music' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container/90 backdrop-blur-xl border-t border-outline-variant/20 pb-safe">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = path === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className="flex flex-col items-center justify-center w-16 h-full relative"
            >
              <div className={`flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300 ${isActive ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface'}`}>
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
              </div>
              <span className={`text-[11px] font-label-sm mt-1 transition-colors ${isActive ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
        
        {/* Profile / Auth Tab */}
        <button 
          onClick={() => user ? openProfileModal() : openAuthModal()}
          className="flex flex-col items-center justify-center w-16 h-full relative"
        >
          <div className="flex items-center justify-center w-12 h-8 rounded-full text-on-surface-variant hover:text-on-surface transition-all duration-300">
            {user ? (
               <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-tertiary text-on-primary flex items-center justify-center font-label-sm font-bold shadow-sm">
                 {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
               </div>
            ) : (
              <span className="material-symbols-outlined text-[24px]">account_circle</span>
            )}
          </div>
          <span className="text-[11px] font-label-sm mt-1 text-on-surface-variant">
            {user ? 'Profile' : 'Sign In'}
          </span>
        </button>
      </nav>
    </div>
  );
}
