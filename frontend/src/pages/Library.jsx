import React, { useEffect, useState } from 'react';
import { getLibrarySongs, removeSongFromLibrary, saveSongToLibrary } from '../utils/db';
import { getDirectoryHandle, deleteFileFromDisk } from '../utils/fs';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Library() {
  const [activeTab, setActiveTab] = useState('audio'); // 'audio', 'video', 'cloud'
  const [dbSongs, setDbSongs] = useState([]);
  const [cloudMedia, setCloudMedia] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAppContext();
  const { user } = useAuth();

  useEffect(() => {
    loadOfflineMedia();
    loadCloudMedia();
  }, []);

  const loadOfflineMedia = async () => {
    try {
      const songs = await getLibrarySongs();
      setDbSongs(songs);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load local device library');
    }
  };

  const loadCloudMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_metadata')
        .select('*');
        
      if (error) throw error;
      setCloudMedia(data || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load cloud media');
    }
  };

  const handleRemoveDb = async (item) => {
    try {
      if (item.hasLocalFile && item.filename) {
        await deleteFileFromDisk(item.filename);
      }
      await removeSongFromLibrary(item.id);
      setDbSongs(prev => prev.filter(s => s.id !== item.id));
      toast.success("Removed from device storage");
    } catch (e) {
      toast.error("Failed to remove file");
    }
  };

  const downloadFromCloud = async (file) => {
    if (isDownloading) return toast.error("Already downloading a file...");
    setIsDownloading(true);
    const toastId = toast.loading(`Downloading ${file.title} to device...`);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(file.url, {
        headers: {
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Failed to fetch from cloud");
      
      const blob = await res.blob();
      await saveSongToLibrary({
        id: file.id,
        title: file.title,
        artist: "Cloud Import",
        blob: blob,
        type: file.type,
        coverUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${file.title}`
      });
      
      toast.success("Saved to device for offline play!", { id: toastId });
      loadOfflineMedia(); // Refresh offline lists
    } catch (e) {
      console.error(e);
      toast.error("Download failed", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  // Filter lists based on tabs
  const offlineAudio = dbSongs.filter(s => s.type === 'audio' || !s.type);
  const offlineVideo = dbSongs.filter(s => s.type === 'video');

  const renderMediaRow = (item, isCloud = false) => {
    const isCurrentlyPlaying = (currentTrack?.id && currentTrack?.id === item.id) || (currentTrack?.filename && currentTrack?.filename === item.filename);
    
    return (
      <tr key={item.id} className={`hover:bg-surface-container-low/50 transition-colors group cursor-pointer ${isCurrentlyPlaying ? 'bg-primary-container/20' : ''}`}>
        <td className="py-4 px-6" onClick={() => !isCloud && playTrack({ ...item, source: 'local' })}>
          <div className="flex items-center gap-4 min-w-[240px]">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-secondary-container flex items-center justify-center shadow-inner">
              {isCurrentlyPlaying && isPlaying ? (
                <div className="flex items-end justify-center gap-0.5 w-full h-full opacity-80 pb-3">
                  <div className="w-1.5 bg-primary rounded-t-sm h-3 animate-pulse" style={{animationDuration: '0.6s'}}></div>
                  <div className="w-1.5 bg-primary rounded-t-sm h-5 animate-pulse" style={{animationDuration: '0.8s'}}></div>
                  <div className="w-1.5 bg-primary rounded-t-sm h-4 animate-pulse" style={{animationDuration: '0.5s'}}></div>
                </div>
              ) : (
                <span className="material-symbols-outlined text-on-secondary-container text-[22px] drop-shadow">
                  {item.type === 'video' ? 'videocam' : 'graphic_eq'}
                </span>
              )}
            </div>
            <div className="flex flex-col min-w-0 max-w-[250px]">
              <span className={`font-label-lg text-label-lg font-semibold truncate group-hover:text-primary transition-colors ${isCurrentlyPlaying ? 'text-primary' : 'text-on-surface'}`}>
                {item.title}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                {item.artist || 'Unknown'}
              </span>
            </div>
          </div>
        </td>
        <td className="py-4 px-4 hidden md:table-cell">
          <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm inline-flex items-center gap-1 font-semibold">
            {isCloud ? '☁️ Cloud' : '📱 Device'}
          </span>
        </td>
        <td className="py-4 px-6 text-right">
          <div className="flex items-center justify-end gap-2">
            {!isCloud && (
              <button 
                onClick={(e) => { e.stopPropagation(); isCurrentlyPlaying ? togglePlay() : playTrack({ ...item, source: 'local' }); }} 
                className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:scale-105 transition-transform" 
                title={isCurrentlyPlaying && isPlaying ? "Pause" : "Play"}
              >
                <span className="material-symbols-outlined">{isCurrentlyPlaying && isPlaying ? "pause" : "play_arrow"}</span>
              </button>
            )}
            
            {isCloud ? (
              <button 
                onClick={(e) => { e.stopPropagation(); downloadFromCloud(item); }}
                disabled={isDownloading}
                className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50" 
                title="Import to Device"
              >
                <span className="material-symbols-outlined">download</span>
              </button>
            ) : (
              <button 
                onClick={(e) => { e.stopPropagation(); handleRemoveDb(item); }}
                className="w-10 h-10 rounded-full hover:bg-error-container text-error flex items-center justify-center transition-colors"
                title="Remove from Device"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const getActiveList = () => {
    if (activeTab === 'audio') return offlineAudio;
    if (activeTab === 'video') return offlineVideo;
    return cloudMedia;
  };

  const activeList = getActiveList();

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-8 mb-24">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Media Library</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage your offline downloads and browse the cloud server.
          </p>
        </div>

        <div className="flex p-1 bg-surface-container-low rounded-xl w-fit border border-outline-variant/30">
          <button 
            onClick={() => setActiveTab('audio')}
            className={`px-6 py-2.5 rounded-lg font-label-md transition-all ${activeTab === 'audio' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">headphones</span>
              Offline Audio
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-6 py-2.5 rounded-lg font-label-md transition-all ${activeTab === 'video' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              Offline Video
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('cloud')}
            className={`px-6 py-2.5 rounded-lg font-label-md transition-all ${activeTab === 'cloud' ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">cloud</span>
              Cloud Server
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-6 border-b border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between">
          <div className="flex items-center gap-3 text-on-surface">
            <span className="material-symbols-outlined text-primary">
              {activeTab === 'cloud' ? 'cloud_sync' : 'sd_storage'}
            </span>
            <span className="font-title-md text-title-md font-semibold">
              {activeTab === 'audio' && 'Device Audio Cache'}
              {activeTab === 'video' && 'Device Video Cache'}
              {activeTab === 'cloud' && 'Central Server Library'}
            </span>
          </div>
<div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-surface-container rounded-full text-on-surface font-label-sm">
              {activeList.length} items
            </span>
            {activeTab === 'cloud' && (
              <button 
                onClick={() => {
                  toast.success("Syncing with cloud server...");
                  loadCloudMedia();
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-container text-on-primary-container rounded-lg font-label-sm hover:bg-primary hover:text-on-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">sync</span>
                Update Library
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Media Details</th>
                <th className="py-4 px-4 font-semibold hidden md:table-cell">Storage Location</th>
                <th className="py-4 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-0 text-body-sm font-body-sm text-on-surface">
              <AnimatePresence mode="popLayout">
                {activeList.map(item => renderMediaRow(item, activeTab === 'cloud'))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {activeList.length === 0 && (
            <div className="w-full py-16 flex flex-col items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] opacity-50 mb-4">
                {activeTab === 'cloud' ? 'cloud_off' : 'folder_off'}
              </span>
              <p className="font-label-lg text-label-lg">
                {activeTab === 'cloud' 
                  ? "No media found on the central server." 
                  : "No downloaded media on this device."}
              </p>
              <p className="font-body-sm text-body-sm mt-1 opacity-70">
                {activeTab === 'cloud'
                  ? "Generate a roadmap and download videos to populate the cloud."
                  : "Switch to the Cloud Server tab to import files for offline play."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
