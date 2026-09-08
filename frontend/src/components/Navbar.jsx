import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-google-dark/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-google-purple to-blue-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] group-hover:scale-110 transition-transform"></div>
          <span className="font-semibold text-xl tracking-tight text-white">Curator<span className="text-google-purple">AI</span></span>
        </Link>
        
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
      </div>
    </nav>
  );
}
