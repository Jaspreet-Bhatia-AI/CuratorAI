import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { supabase } from "../utils/supabase";
import { saveSongToLibrary } from '../utils/db';
import { saveFileToDisk } from '../utils/fs';
import { motion } from 'framer-motion';


const formatDuration = (secs) => {
  if (!secs) return "00:00";
  if (typeof secs === 'string' && secs.includes(':')) return secs;
  const totalSeconds = parseInt(secs, 10);
  if (isNaN(totalSeconds)) return "00:00";
  
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  
  const pad = (num) => num.toString().padStart(2, '0');
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
};

export default function MediaGrid({ items }) {
  const [downloadingUrls, setDownloadingUrls] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [formats, setFormats] = useState({});
  const [globalFormat, setGlobalFormat] = useState('mp3');
  const abortControllers = useRef({});

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(i => i.url)));
    }
  };

  const toggleSelect = (url) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(url)) newSet.delete(url);
    else newSet.add(url);
    setSelectedItems(newSet);
  };

  const handleFormatChange = (url, format) => {
    setFormats(prev => ({ ...prev, [url]: format }));
  };

  const handleGlobalFormatChange = (e) => {
    const newFormat = e.target.value;
    setGlobalFormat(newFormat);
    const newFormats = { ...formats };
    items.forEach(i => newFormats[i.url] = newFormat);
    setFormats(newFormats);
  };

  const cancelDownload = (url) => {
    if (abortControllers.current[url]) {
      abortControllers.current[url].abort();
      delete abortControllers.current[url];
    }
  };

  const cancelAll = () => {
    Object.keys(abortControllers.current).forEach(url => {
      cancelDownload(url);
    });
  };

  const handleDownload = async (item, retryCount = 0) => {
    try {
      const format = formats[item.url] || globalFormat;
      setDownloadingUrls(prev => ({ ...prev, [item.url]: true }));
      toast.loading(`Downloading ${item.title} (${format})...`, { id: item.url });
      
      const controller = new AbortController();
      abortControllers.current[item.url] = controller;

      const response = await fetch('/api/download-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: item.url, format: format }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error('Failed to download media');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${item.title.replace(/[^a-zA-Z0-9 ]/g, '')}.${format === 'mp3' ? 'mp3' : 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // Save metadata to internal library (WITHOUT the massive blob payload to save DB space)
      await saveSongToLibrary({
        id: item.url,
        title: item.title,
        artist: item.channel,
        type: format.includes('video') ? 'video' : 'audio',
        filename: filename,
        hasLocalFile: true,
        timestamp: new Date()
      });
      
      toast.success(`Saved to offline library!`, { id: item.url });
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error("Download cancelled.", { id: item.url });
        setDownloadingUrls(prev => ({ ...prev, [item.url]: false }));
      } else {
        console.error("Download error:", error);
        if (retryCount < 3) {
          toast.loading(`Retrying ${item.title} (${retryCount + 1}/3)...`, { id: item.url });
          // Exponential backoff
          await new Promise(r => setTimeout(r, 2000 * (retryCount + 1)));
          return handleDownload(item, retryCount + 1);
        } else {
          toast.error("Failed after 3 retries.", { id: item.url });
          setDownloadingUrls(prev => ({ ...prev, [item.url]: false }));
        }
      }
    } finally {
      if (retryCount === 0) {
        delete abortControllers.current[item.url];
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const downloadSelected = async () => {
    const itemsToDownload = items.filter(i => selectedItems.has(i.url) && !downloadingUrls[i.url]);
    if (itemsToDownload.length === 0) return toast.error("No valid items selected");
    
    toast.success(`Starting batch download of ${itemsToDownload.length} items...`);
    
    // Process in batches of 2 to avoid rate limiting from YouTube
    for (let i = 0; i < itemsToDownload.length; i += 2) {
      const batch = itemsToDownload.slice(i, i + 2);
      await Promise.all(batch.map(item => handleDownload(item)));
    }
  };

  if (!items || items.length === 0) return null;

  const isAnyDownloading = Object.values(downloadingUrls).some(status => status);

  return (
    <div className="flex flex-col gap-4 w-full mb-12">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-3 cursor-pointer text-on-surface font-label-md select-none group">
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedItems.size === items.length && items.length > 0 ? 'bg-primary border-primary' : 'border-outline group-hover:border-primary'}`}>
               {selectedItems.size === items.length && items.length > 0 && <span className="material-symbols-outlined text-[16px] text-on-primary">check</span>}
            </div>
            <input 
              type="checkbox" 
              className="hidden"
              checked={selectedItems.size === items.length && items.length > 0}
              onChange={toggleSelectAll}
            />
            <span>Select All ({selectedItems.size}/{items.length})</span>
          </label>

          <div className="h-6 w-px bg-outline-variant/50 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="font-label-sm text-on-surface-variant">Format:</span>
            <select 
              className="bg-surface-container-low text-on-surface border border-outline-variant rounded-xl px-3 py-1.5 text-sm font-label-md focus:outline-none focus:border-primary cursor-pointer shadow-sm"
              value={globalFormat}
              onChange={handleGlobalFormatChange}
            >
              <option value="mp3">Audio Only</option>
              <option value="720p">720p (Faster Download)</option>
              <option value="1080p">1080p+ (Better Quality, Slower)</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isAnyDownloading && (
            <button 
              onClick={cancelAll}
              className="px-4 py-2 bg-error/10 text-error font-label-md rounded-xl hover:bg-error/20 flex items-center gap-2 transition-all flex-1 sm:flex-none justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
              <span>Cancel All</span>
            </button>
          )}
          <button 
            onClick={downloadSelected}
            disabled={selectedItems.size === 0}
            className="px-5 py-2 bg-primary text-on-primary font-label-md rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:opacity-90 shadow-sm transition-all flex-1 sm:flex-none justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
            <span>Download Selected</span>
          </button>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => {
          const isDownloading = downloadingUrls[item.url];
          const isSelected = selectedItems.has(item.url);
          const rationale = item.original_item?.rationale;
          const currentFormat = formats[item.url] || globalFormat;
          
          return (
            <motion.article 
              variants={itemVariants} 
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              key={idx} 
              className={`flex flex-col bg-surface-container-low rounded-[28px] overflow-hidden shadow-sm hover:shadow-md transition-all border-2 ${isSelected ? 'border-primary' : 'border-transparent'}`}
            >
              <div className="relative aspect-video w-full bg-surface-container overflow-hidden group cursor-pointer" onClick={() => toggleSelect(item.url)}>
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={item.title} 
                  src={item.thumbnail || `https://picsum.photos/seed/${idx + item.title}/640/360`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent opacity-70"></div>
                
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest/80 text-on-surface backdrop-blur-md'}`}>
                     {isSelected && <span className="material-symbols-outlined text-[18px]">check</span>}
                  </div>
                </div>
                
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-on-background/80 text-background font-label-md backdrop-blur-sm">
                  {formatDuration(item.duration)}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="font-headline-sm text-[20px] text-on-surface line-clamp-2 leading-tight" title={item.title}>
                    {item.title}
                  </h2>
                  <p className="font-body-md text-on-surface-variant line-clamp-2 leading-snug opacity-80">
                    <span className="font-medium">{item.channel || "YouTube"}</span>
                    <br/>
                    {item.views ? item.views.toLocaleString() : "0"} views
                    {item.upload_date && ` • ${item.upload_date}`}
                  </p>
                  {rationale && (
                    <div className="mt-2 flex gap-3 items-start bg-secondary-container/50 p-3 rounded-2xl">
                      <span className="material-symbols-outlined text-[18px] text-on-secondary-container mt-0.5">auto_awesome</span>
                      <p className="font-body-sm text-on-secondary-container line-clamp-3 leading-relaxed">
                        {rationale}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 pt-3 mt-1">
                  {isDownloading ? (
                    <div className="p-3 rounded-2xl bg-surface-container-high flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="font-label-lg font-medium">Downloading...</span>
                        </div>
                        <button 
                          onClick={() => cancelDownload(item.url)}
                          className="w-8 h-8 rounded-full hover:bg-error-container text-error flex items-center justify-center transition-colors"
                          title="Cancel Download"
                        >
                          <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                      </div>
                      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select 
                        className="bg-surface-container-highest text-on-surface border-none rounded-full px-4 py-3 text-sm font-label-lg focus:outline-none focus:ring-2 focus:ring-primary/50 flex-1 min-w-0 cursor-pointer transition-colors"
                        value={currentFormat}
                        onChange={(e) => handleFormatChange(item.url, e.target.value)}
                      >
                        <option value="mp3">Audio Only</option>
                        <option value="720p">720p</option>
                        <option value="1080p">1080p+</option>
                      </select>
                      <button 
                        onClick={() => handleDownload(item)}
                        className="bg-primary hover:bg-primary/90 text-on-primary rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-sm active:scale-[0.95]"
                        title="Download"
                      >
                        <span className="material-symbols-outlined text-[24px]">download</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </div>
  );
}
