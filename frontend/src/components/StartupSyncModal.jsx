import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { getLibrarySongs } from '../utils/db';
import { useSync } from '../context/SyncContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function StartupSyncModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMediaCount, setNewMediaCount] = useState(0);
  const [cloudMedia, setCloudMedia] = useState([]);
  const [customSyncCount, setCustomSyncCount] = useState('');
  
  const { startBatchSync } = useSync();

  useEffect(() => {
    const timer = setTimeout(() => {
      checkForNewCloudMedia();
    }, 2500); // Wait a bit after app load
    return () => clearTimeout(timer);
  }, []);

  const checkForNewCloudMedia = async () => {
    try {
      const localSongs = await getLibrarySongs();
      const localIds = new Set(localSongs.map(s => s.id));

      const { data: cloudSongs, error } = await supabase
        .from('media_metadata')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (cloudSongs && cloudSongs.length > 0) {
        const missing = cloudSongs.filter(c => !localIds.has(c.id));
        if (missing.length > 0) {
          setCloudMedia(cloudSongs);
          setNewMediaCount(missing.length);
          setIsOpen(true);
        }
      }
    } catch (error) {
      console.error("Failed to check for new cloud media on startup:", error);
    }
  };

  const handleSync = (count) => {
    if (count > 0) {
      startBatchSync(cloudMedia, count);
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-surface-container p-6 rounded-3xl w-full max-w-sm shadow-2xl border border-outline-variant/30 relative"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
            
            <div className="flex items-center gap-3 text-secondary mb-2">
              <span className="material-symbols-outlined text-3xl">cloud_download</span>
              <h3 className="text-xl font-headline-sm text-on-surface">New Cloud Music</h3>
            </div>
            
            <p className="text-sm font-body-md text-on-surface-variant mb-6">
              You have <strong className="text-on-surface">{newMediaCount}</strong> new items available in your cloud server. How many recent tracks would you like to download for offline playback?
            </p>
            
            <div className="flex flex-col gap-2 mb-4">
              <button 
                onClick={() => handleSync(100)}
                className="w-full py-3 bg-primary-container text-on-primary-container rounded-xl font-label-lg hover:bg-primary hover:text-on-primary transition-all active:scale-[0.98]"
              >
                Latest 100
              </button>
              <button 
                onClick={() => handleSync(200)}
                className="w-full py-3 bg-primary-container text-on-primary-container rounded-xl font-label-lg hover:bg-primary hover:text-on-primary transition-all active:scale-[0.98]"
              >
                Latest 200
              </button>
              <button 
                onClick={() => handleSync(500)}
                className="w-full py-3 bg-primary-container text-on-primary-container rounded-xl font-label-lg hover:bg-primary hover:text-on-primary transition-all active:scale-[0.98]"
              >
                Latest 500
              </button>
              <button 
                onClick={() => handleSync(newMediaCount)}
                className="w-full py-3 bg-secondary-container text-on-secondary-container rounded-xl font-label-lg hover:bg-secondary hover:text-on-secondary transition-all active:scale-[0.98]"
              >
                Download All ({newMediaCount})
              </button>
              
              <div className="flex gap-2 mt-2">
                <input 
                  type="number" 
                  value={customSyncCount}
                  onChange={(e) => setCustomSyncCount(e.target.value)}
                  placeholder="Custom count..."
                  className="flex-1 bg-surface-container-high border border-outline-variant/30 focus:border-primary rounded-xl px-4 py-3 text-on-surface font-body-md outline-none transition-colors"
                />
                <button 
                  onClick={() => handleSync(parseInt(customSyncCount, 10) || 0)}
                  className="px-6 py-3 bg-primary text-on-primary rounded-xl font-label-lg hover:opacity-90 shadow-sm transition-all active:scale-[0.98]"
                >
                  Sync
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-2 mt-2 font-label-md text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Skip for now
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
