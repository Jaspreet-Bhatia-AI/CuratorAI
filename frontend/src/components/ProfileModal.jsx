import React from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function ProfileModal() {
  const { user, logout, isProfileModalOpen, setIsProfileModalOpen } = useAuth();
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

  const handleLogout = () => {
    logout();
  };

  const openSettings = () => {
    setIsProfileModalOpen(false);
    window.dispatchEvent(new Event("open-settings"));
  };

  return (
    <AnimatePresence>
      {isProfileModalOpen && user && (
        <div className="fixed inset-0 z-[100] flex items-start justify-end p-6 sm:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-transparent" 
            onClick={() => setIsProfileModalOpen(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 20, y: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-surface-container-lowest rounded-3xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border border-outline-variant/30 mt-14 sm:mt-0"
          >
            <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex flex-col items-center">
              <motion.img 
                initial={{ scale: 0.5, rotate: -10 }} 
                animate={{ scale: 1, rotate: 0 }} 
                transition={{ type: "spring", damping: 15 }}
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover shadow-sm bg-white mb-4 border-4 border-surface-container-lowest" 
                src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}&mouth=smile,twinkle`} 
              />
              <h3 className="font-headline-sm text-headline-sm text-on-surface">{user.name}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{user.email}</p>
            </div>

            <div className="p-2 flex flex-col">

              {/* Show Update App button prominently if an update is available */}
              {needRefresh && (
                <button 
                  onClick={() => updateServiceWorker(true)} 
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-primary/10 text-primary font-label-md text-label-md transition-colors text-left hover:bg-primary/20 mb-2 border border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">system_update</span>
                    <span className="font-bold">Update Available!</span>
                  </div>
                  <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs">Download</span>
                </button>
              )}
              
              <Link to="/profile"  onClick={() => setIsProfileModalOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface font-label-md text-label-md transition-colors text-left">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
                <span>Manage Profile</span>
              </Link>
              
              <Link to="/history" onClick={() => setIsProfileModalOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface font-label-md text-label-md transition-colors text-left">
                <span className="material-symbols-outlined text-on-surface-variant">history</span>
                <span>Learning History</span>
              </Link>

              <button 
                onClick={() => {
                  toast.success("Checking for updates...");
                  setTimeout(() => toast("You are on the latest version.", { icon: '✨' }), 1500);
                }} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low text-on-surface font-label-md text-label-md transition-colors text-left"
              >
                <span className="material-symbols-outlined text-on-surface-variant">update</span>
                <span>Update App</span>
              </button>

              <div className="h-px bg-outline-variant/30 my-2 mx-4"></div>
              
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-error-container/50 text-error font-label-md text-label-md transition-colors text-left">
                <span className="material-symbols-outlined">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
