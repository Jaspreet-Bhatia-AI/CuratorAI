import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { saveSongToLibrary } from '../utils/db';

export default function MediaGrid({ items }) {
  const [downloadingUrl, setDownloadingUrl] = useState(null);

  const handleDownload = async (item) => {
    try {
      setDownloadingUrl(item.url);
      toast.loading(`Downloading ${item.title}...`, { id: item.url });
      
      const res = await fetch('/api/download-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: item.url })
      });
      
      if (!res.ok) throw new Error("Download failed on server");
      
      const blob = await res.blob();
      await saveSongToLibrary({
        id: item.url,
        title: item.title,
        blob: blob,
        timestamp: new Date()
      });
      
      toast.success("Saved to offline library!", { id: item.url });
    } catch (error) {
      console.error(error);
      toast.error("Failed to download audio.", { id: item.url });
    } finally {
      setDownloadingUrl(null);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {items.map((item, idx) => {
        const isDownloading = downloadingUrl === item.url;
        
        return (
          <article key={idx} className="group bg-surface-container-lowest dark:bg-google-surface/60 border border-surface-container-highest dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
            {/* Thumbnail Wrapper */}
            <div className="relative w-full aspect-video overflow-hidden bg-surface-container-high dark:bg-black/50">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                alt={item.title} 
                src={item.thumbnail || `https://picsum.photos/seed/${idx + item.title}/640/360`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-black/60 backdrop-blur-md text-white font-label-sm text-label-sm px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-secondary-fixed">hd</span>
                  4K UHD
                </span>
              </div>
              
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white font-label-sm text-label-sm px-2 py-0.5 rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {item.duration || "03:42"}
              </div>
              
              <button aria-label="Play" className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-primary/90 text-on-primary flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-lg backdrop-blur-sm" type="button">
                <span className="material-symbols-outlined text-[26px]">play_arrow</span>
              </button>
            </div>
            
            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-label-sm text-label-sm text-secondary dark:text-google-purple font-bold tracking-wider uppercase truncate">
                    SEED #{89400 + idx}
                  </span>
                  <span className="flex items-center gap-1 font-label-sm text-label-sm text-tertiary dark:text-gray-400">
                    <span className="material-symbols-outlined text-[14px]">visibility</span> {item.views || "1.4k"}
                  </span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-google-purple transition-colors mb-1.5 line-clamp-1" title={item.title}>
                  {item.title}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                  Fine-tuned neural weights modeling high-viscosity iridescent dynamics under directional spotlights.
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between py-2 border-t border-surface-container dark:border-white/10 text-outline dark:text-gray-500 font-body-sm text-body-sm mb-3">
                  <span className="flex items-center gap-1 text-on-surface-variant dark:text-gray-300 truncate">
                    <span className="material-symbols-outlined text-[16px]">person</span> {item.channel || "Curator Bot"}
                  </span>
                  <span>3840x2160</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button 
                    onClick={() => handleDownload(item)}
                    disabled={isDownloading}
                    className="flex-1 bg-secondary text-on-secondary hover:bg-secondary-container dark:bg-google-purple dark:hover:bg-google-purple/80 dark:text-white font-label-md text-label-md px-3.5 py-2 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        <span>Save <span className="opacity-80 font-normal hidden sm:inline">(MP4)</span></span>
                      </>
                    )}
                  </button>
                  <button aria-label="Bookmark seed" className="p-2 rounded-xl bg-surface-container dark:bg-white/5 hover:bg-surface-container-high dark:hover:bg-white/10 text-on-surface-variant dark:text-gray-400 hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
