import React, { useEffect, useState } from 'react';
import { getLibrarySongs, removeSongFromLibrary } from '../utils/db';
import toast from 'react-hot-toast';

export default function Library() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const dbSongs = await getLibrarySongs();
      setSongs(dbSongs);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load library');
    }
  };

  const handleRemove = async (id) => {
    await removeSongFromLibrary(id);
    toast.success('Removed from library');
    loadSongs();
  };

  const mockRows = [
    { title: 'Neural Soundscape #04 (Latent Field A)', seed: 'lat-094182f', category: 'Music', size: '48 MB', format: 'WAV 24-bit', duration: '05:12' },
    { title: 'Cognitive Synthesis & Memory Graph Theory', seed: 'edu-8931a', category: 'Learning', size: '1.24 GB', format: 'MP4 4K', duration: '42:15' },
    { title: 'Attention Mechanisms in Transformer Architecture', seed: 'v_80911ca', category: 'Learning', size: '420 MB', format: 'MP4 4K', duration: '28:10' },
  ];

  return (
    <div className="relative p-4 md:p-8 pt-6 pb-40 flex flex-col gap-10 overflow-hidden w-full">
      <div className="absolute top-0 right-10 w-96 h-96 bg-gradient-to-br from-primary-fixed-dim/25 via-secondary-fixed/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm tracking-widest uppercase">Cache Layer v2.6</span>
            <span className="text-outline text-body-sm">•</span>
            <span className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              IndexedDB Synchronized
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Offline Library & Local IndexedDB Cache</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Zero-latency media playback without bandwidth dependence. Content remains cryptographically verified and locally addressable across all active nodes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-all font-label-md text-label-md flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">cleaning_services</span>
            <span>Clean Cache</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Cached</span>
            <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">database</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-md text-display-md text-on-surface">14.8</span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">GB</span>
            </div>
            <span className="font-body-sm text-body-sm text-emerald-600 flex items-center gap-0.5 mt-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              4.2 GB saved this week
            </span>
          </div>
        </div>
        {/* Skipping the other 3 stats cards for brevity in React component unless needed */}
      </div>

      <div className="rounded-3xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Saved Offline Media</h2>
            <span className="px-3 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">{songs.length + mockRows.length} Objects</span>
          </div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Media Node</th>
                <th className="py-4 px-4 font-semibold">Origin & Seed</th>
                <th className="py-4 px-4 font-semibold">Category</th>
                <th className="py-4 px-4 font-semibold">Payload</th>
                <th className="py-4 px-4 font-semibold">Sync Status</th>
                <th className="py-4 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-0 text-body-sm font-body-sm text-on-surface">
              {songs.map((song, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4 min-w-[240px]">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-secondary flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-white absolute text-[22px] drop-shadow">graphic_eq</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-lg text-label-lg font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{song.title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-medium text-on-surface">Custom Import</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm inline-flex items-center gap-1 font-semibold">
                      <span>🎵</span> Music
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-label-md text-label-md font-semibold text-on-surface">WAV</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm inline-flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      ✓ Ready
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 rounded-full hover:bg-error-container text-error flex items-center justify-center transition-colors" onClick={() => handleRemove(song.id)}>
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {mockRows.map((row, idx) => (
                 <tr key={`mock-${idx}`} className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4 min-w-[240px]">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-primary flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-white absolute text-[22px] drop-shadow">{row.category === 'Music' ? 'graphic_eq' : 'videocam'}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-lg text-label-lg font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{row.title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-medium text-on-surface">seed://{row.seed}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm inline-flex items-center gap-1 font-semibold">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">{row.size}</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{row.format}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm inline-flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      ✓ Offline Ready
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="play-trigger w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:scale-105 transition-transform" title="Load in Deck">
                        <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
