import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { getLibrarySongs, saveSongToLibrary } from '../utils/db';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

export default function CloudSyncManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMedia, setNewMedia] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // We only want this to run once on startup, wait a bit so it doesn't interrupt UI
    const timer = setTimeout(() => {
      checkForNewCloudMedia();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const checkForNewCloudMedia = async () => {
    try {
      // 1. Get local songs
      const localSongs = await getLibrarySongs();
      const localIds = new Set(localSongs.map(s => s.id));

      // 2. Get cloud songs
      const { data: cloudSongs, error } = await supabase
        .from('media_metadata')
        .select('*');
        
      if (error) throw error;
      
      if (cloudSongs && cloudSongs.length > 0) {
        // 3. Diff
        const missing = cloudSongs.filter(c => !localIds.has(c.id));
        if (missing.length > 0) {
          setNewMedia(missing);
          setIsOpen(true);
        }
      }
    } catch (e) {
      console.error("Failed to check cloud sync", e);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    let successCount = 0;
    
    for (let i = 0; i < newMedia.length; i++) {
      const file = newMedia[i];
      setProgress(Math.round(((i) / newMedia.length) * 100));
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(file.url, {
          headers: {
            ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
          }
        });
        if (!res.ok) throw new Error("Fetch failed");
        
        const blob = await res.blob();
        await saveSongToLibrary({
          ...file,
          blob,
          hasLocalFile: true,
          type: file.type || 'audio'
        });
        successCount++;
      } catch (err) {
        console.error("Failed downloading", file.title, err);
      }
    }
    
    setProgress(100);
    setIsDownloading(false);
    setIsOpen(false);
    toast.success(`Successfully downloaded ${successCount} new tracks!`);
    
    // Dispatch event to update library if open
    window.dispatchEvent(new Event('library-updated'));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/50 backdrop-blur-md" 
            onClick={() => !isDownloading && setIsOpen(false)}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-surface-container-lowest rounded-[28px] shadow-2xl overflow-hidden flex flex-col border border-outline-variant/30 p-6"
          >
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">cloud_download</span>
            </div>
            
            <h2 className="font-headline-sm text-[24px] text-center text-on-surface mb-2 font-bold">New Cloud Music!</h2>
            <p className="font-body-md text-center text-on-surface-variant mb-6 leading-relaxed">
              We found <strong>{newMedia.length}</strong> new {newMedia.length === 1 ? 'track' : 'tracks'} in the cloud that aren't on your device yet. Download them now for offline listening?
            </p>

            {isDownloading ? (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between font-label-sm text-on-surface">
                  <span>Downloading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDownloadAll}
                  className="w-full py-3.5 rounded-full bg-primary text-on-primary font-bold text-[16px] hover:opacity-90 shadow-sm transition-opacity active:scale-[0.98]"
                >
                  Download All Now
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 rounded-full bg-transparent text-on-surface font-semibold text-[16px] hover:bg-surface-container-low transition-colors"
                >
                  Skip for now
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
