import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { saveSongToLibrary } from '../utils/db';

export default function MediaGrid({ items }) {
  const [downloadingUrl, setDownloadingUrl] = useState(null);

  const handleDownload = async (item) => {
    try {
      setDownloadingUrl(item.url || item.title);
      toast.loading(`Downloading ${item.title}...`, { id: item.title });
      
      const res = await fetch('/api/download-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: item.url })
      });
      
      if (!res.ok) throw new Error("Download failed on server");
      
      const blob = await res.blob();
      await saveSongToLibrary({
        id: item.url || item.title,
        title: item.title,
        blob: blob,
        timestamp: new Date()
      });
      
      toast.success("Saved to offline library!", { id: item.title });
    } catch (error) {
      console.error(error);
      toast.error("Failed to download audio.", { id: item.title });
    } finally {
      setDownloadingUrl(null);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
      {items.map((item, idx) => {
        const isDownloading = downloadingUrl === (item.url || item.title);
        
        return (
          <article key={idx} className="flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="relative aspect-video w-full bg-surface-container overflow-hidden group">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={item.title} 
                src={item.thumbnail || `https://picsum.photos/seed/${idx + item.title}/640/360`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/60 via-transparent to-transparent"></div>
              
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm">
                  {item.format || '4K UHD'}
                </span>
                {idx === 2 && (
                   <span className="px-2 py-0.5 rounded-md bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm">Cached</span>
                )}
              </div>
              
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-on-background/80 text-background font-label-sm text-label-sm backdrop-blur-sm">
                {item.duration || "03:42"}
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-1 justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="font-headline-sm text-headline-sm text-on-surface truncate" title={item.title}>
                  {item.title}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  {item.views || "1.4k"} views • Curator Studio
                </p>
              </div>
              
              <div className="flex flex-col gap-2 pt-1">
                {isDownloading ? (
                  <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-2">
                    <div className="flex items-center justify-between text-primary">
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-label-sm text-label-sm font-semibold">Downloading...</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                ) : idx === 2 ? (
                  // Offline Ready Mock State
                  <div className="w-full py-2 px-3 rounded-xl bg-surface-container-low flex items-center justify-between text-on-surface">
                    <div className="flex items-center gap-1.5 text-tertiary">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span className="font-label-md text-label-md">Offline Ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">420 MB</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleDownload(item)}
                    className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-md text-label-md rounded-xl py-2 px-3 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                    <span>Download to Offline Library</span>
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
