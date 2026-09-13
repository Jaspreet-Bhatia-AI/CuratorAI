import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PwaUpdater() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Periodic check for updates every hour
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  const close = () => {
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-gradient-to-r from-google-purple to-blue-500 text-white px-6 py-3 rounded-full shadow-2xl border border-white/20"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <span className="font-medium text-sm">New Update Available!</span>
          </div>
          <div className="flex items-center gap-2 border-l border-white/20 pl-4">
            <button 
              onClick={() => updateServiceWorker(true)}
              className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold hover:scale-105 transition-transform"
            >
              Refresh App
            </button>
            <button 
              onClick={close}
              className="text-white/70 hover:text-white p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
