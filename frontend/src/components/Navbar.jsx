import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, credits, setIsLoginModalOpen, logout } = useAuth();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Library', path: '/library' },
    { name: 'About', path: '/about' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-google-dark/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-google-purple to-blue-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform"></div>
          <span className="font-semibold text-xl tracking-tight text-white flex items-center">Curator <span className="text-sm font-normal text-gray-400 ml-3 border-l border-white/20 pl-3">by <span className="font-bold text-google-purple tracking-wide">JB AI</span></span></span>
        </Link>
        
        <div className="flex items-center gap-8">
          <div className="flex gap-6">
            {links.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className="relative px-3 py-2 text-sm font-medium transition-colors hover:text-white"
                >
                  <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-l border-white/10 pl-8 flex items-center gap-4">
            {user ? (
              <>
                <div className="flex flex-col items-end mr-2">
                  <span className="text-sm font-medium text-white">{user.name}</span>
                  <span className="text-xs text-google-purple flex items-center gap-1 font-mono">
                    <div className="w-2 h-2 rounded-full bg-google-purple shadow-[0_0_8px_rgba(139,92,246,0.8)]"></div>
                    {credits} Credits
                  </span>
                </div>
                <div className="relative group cursor-pointer">
                  <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-white/20 hover:border-google-purple transition-colors" />
                  <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg">Sign out</button>
                  </div>
                </div>
              </>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold py-2 px-6 rounded-full transition-all hover:scale-105 active:scale-95"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
