import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { supabase } from "../utils/supabase";
import { saveSongToLibrary } from '../utils/db';
import { motion } from 'framer-motion';

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

  const handleDownload = async (item) => {
    try {
      const format = formats[item.url] || globalFormat;
      setDownloadingUrls(prev => ({ ...prev, [item.url]: true }));
      toast.loading(`Downloading ${item.title} (${format})...`, { id: item.url });
      
      const controller = new AbortController();
      abortControllers.current[item.url] = controller;

      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch('/api/download-audio', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ url: item.url, format }),
        signal: controller.signal
      });
      
      if (!res.ok) throw new Error("Download failed on server");
      
      const blob = await res.blob();
      await saveSongToLibrary({
        id: item.url,
        title: item.title,
        blob: blob,
        timestamp: new Date()
      });
      
      toast.success(`Saved to offline library!`, { id: item.url });
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error("Download cancelled.", { id: item.url });
      } else {
        console.error(error);
        toast.error("Failed to download.", { id: item.url });
      }
    } finally {
      setDownloadingUrls(prev => ({ ...prev, [item.url]: false }));
      delete abortControllers.current[item.url];
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
    for (const item of itemsToDownload) {
      handleDownload(item); // Run them concurrently
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
              <option value="mp3">Audio (MP3)</option>
              <option value="720p">720p Video</option>
              <option value="1080p">1080p Video</option>
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
            <motion.article variants={itemVariants} key={idx} className={`flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border-2 ${isSelected ? 'border-primary' : 'border-transparent'}`}>
              <div className="relative aspect-video w-full bg-surface-container overflow-hidden group cursor-pointer" onClick={() => toggleSelect(item.url)}>
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={item.title} 
                  src={item.thumbnail || `https://picsum.photos/seed/${idx + item.title}/640/360`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent"></div>
                
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <div className={`w-6 h-6 rounded flex items-center justify-center border shadow-sm transition-all ${isSelected ? 'bg-primary border-primary' : 'bg-surface-container-lowest/80 border-outline backdrop-blur-md'}`}>
                     {isSelected && <span className="material-symbols-outlined text-[18px] text-on-primary">check</span>}
                  </div>
                </div>
                
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-on-background/80 text-background font-label-sm text-label-sm backdrop-blur-sm">
                  {item.duration || "00:00"}
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface line-clamp-2" title={item.title}>
                    {item.title}
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {item.views ? item.views.toLocaleString() : "1.4k"} views • {item.channel || "YouTube"}
                  </p>
                  {rationale && (
                    <div className="mt-3 flex gap-2 items-start bg-secondary-container/30 p-2.5 rounded-xl border border-secondary/10">
                      <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">auto_awesome</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                        {rationale}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/30 mt-1">
                  {isDownloading ? (
                    <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="font-label-sm text-label-sm font-semibold">Downloading...</span>
                        </div>
                        <button 
                          onClick={() => cancelDownload(item.url)}
                          className="w-6 h-6 rounded-full hover:bg-error/10 text-error flex items-center justify-center transition-colors"
                          title="Cancel Download"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select 
                        className="bg-surface-container-low text-on-surface border border-outline-variant rounded-xl px-3 py-2 text-sm font-label-md focus:outline-none focus:border-primary flex-1 min-w-0 cursor-pointer shadow-sm hover:bg-surface-container transition-colors"
                        value={currentFormat}
                        onChange={(e) => handleFormatChange(item.url, e.target.value)}
                      >
                        <option value="mp3">Audio (MP3)</option>
                        <option value="720p">720p Video (Fast)</option>
                        <option value="1080p">1080p Video (Slow)</option>
                      </select>
                      <button 
                        onClick={() => handleDownload(item)}
                        className="bg-primary hover:opacity-90 text-on-primary rounded-xl py-2 px-4 flex items-center justify-center transition-all shadow-sm active:scale-[0.98]"
                        title="Download"
                      >
                        <span className="material-symbols-outlined text-[20px]">download</span>
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
