import React, { createContext, useContext, useState, useCallback } from 'react';
import { getLibrarySongs, saveSongToLibrary } from '../utils/db';

const SyncContext = createContext();

export const useSync = () => useContext(SyncContext);

export const SyncProvider = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [totalToSync, setTotalToSync] = useState(0);
  const [syncCompletedCount, setSyncCompletedCount] = useState(0);
  const [activeDownloads, setActiveDownloads] = useState([]);

  const startBatchSync = useCallback(async (cloudSongs, targetCount) => {
    try {
      const librarySongs = await getLibrarySongs();
      const existingIds = new Set(librarySongs.map(song => song.id));
      
      const filteredSongs = cloudSongs.filter(song => !existingIds.has(song.id));
      const queue = filteredSongs.slice(0, targetCount);
      
      if (queue.length === 0) {
        return; // Nothing to sync
      }

      setTotalToSync(queue.length);
      setSyncCompletedCount(0);
      setIsSyncing(true);
      setActiveDownloads([]);

      let currentIndex = 0;
      let activeCount = 0;
      const MAX_CONCURRENT = 3;

      const processNext = async () => {
        if (currentIndex >= queue.length && activeCount === 0) {
          setIsSyncing(false);
          return;
        }

        while (activeCount < MAX_CONCURRENT && currentIndex < queue.length) {
          const song = queue[currentIndex];
          currentIndex++;
          activeCount++;
          
          downloadSong(song).finally(() => {
            activeCount--;
            setSyncCompletedCount(prev => prev + 1);
            processNext();
          });
        }
      };

      const downloadSong = async (song) => {
        setActiveDownloads(prev => [...prev, { id: song.id, title: song.title, progress: 0 }]);
        
        try {
          const url = song.file_url || song.url;
          if (!url) throw new Error("No URL provided");
          const response = await fetch(url);
          
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const contentLength = response.headers.get('content-length');
          const total = parseInt(contentLength, 10);
          let loaded = 0;
          
          const reader = response.body.getReader();
          const chunks = [];
          
          while(true) {
            const {done, value} = await reader.read();
            if (done) break;
            
            chunks.push(value);
            loaded += value.length;
            
            if (total) {
              const progress = Math.round((loaded / total) * 100);
              setActiveDownloads(prev => prev.map(d => 
                d.id === song.id ? { ...d, progress } : d
              ));
            }
          }
          
          const blob = new Blob(chunks);
          await saveSongToLibrary({
            id: song.id,
            title: song.title,
            artist: song.artist || 'Cloud',
            blob
          });
          
        } catch (error) {
          console.error("Failed to download song:", song.title, error);
        } finally {
          setActiveDownloads(prev => prev.filter(d => d.id !== song.id));
        }
      };

      processNext();

    } catch (error) {
      console.error("Batch sync failed:", error);
      setIsSyncing(false);
    }
  }, []);

  return (
    <SyncContext.Provider value={{ isSyncing, totalToSync, syncCompletedCount, activeDownloads, startBatchSync }}>
      {children}
    </SyncContext.Provider>
  );
};
