import React, { useState } from 'react';

export default function FloatingPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-5xl z-50 bg-surface-container-lowest/90 dark:bg-google-dark/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_-8px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.5)] border border-surface-container-highest dark:border-white/10 py-2.5 px-6 flex items-center justify-between gap-4">
      
      {/* Left: Track Info */}
      <div className="flex items-center gap-3 min-w-0 max-w-[240px]">
        <div className="w-10 h-10 rounded-xl bg-surface-container-high dark:bg-google-purple/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary dark:text-google-purple text-[20px]">graphic_eq</span>
        </div>
        <div className="min-w-0 hidden sm:block">
          <p className="font-label-md text-label-md text-on-surface dark:text-white truncate">Neural Soundscape #04</p>
          <p className="font-body-sm text-body-sm text-outline dark:text-gray-400 truncate">AI Ambient • 24-bit 48kHz</p>
        </div>
      </div>
      
      {/* Center: Controls */}
      <div className="flex-1 max-w-xl flex flex-col items-center gap-1">
        <div className="flex items-center gap-4 text-on-surface-variant dark:text-gray-300">
          <button className="hover:text-primary dark:hover:text-google-purple transition-colors hidden sm:block" type="button">
            <span className="material-symbols-outlined text-[18px]">shuffle</span>
          </button>
          <button className="hover:text-primary dark:hover:text-google-purple transition-colors" type="button">
            <span className="material-symbols-outlined text-[20px]">skip_previous</span>
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-primary dark:bg-google-purple text-on-primary dark:text-white flex items-center justify-center hover:bg-primary-container dark:hover:bg-google-purple/80 shadow-[0_4px_12px_rgba(70,72,212,0.3)] transition-transform active:scale-95" 
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
          </button>
          <button className="hover:text-primary dark:hover:text-google-purple transition-colors" type="button">
            <span className="material-symbols-outlined text-[20px]">skip_next</span>
          </button>
          <button className="hover:text-primary dark:hover:text-google-purple transition-colors hidden sm:block" type="button">
            <span className="material-symbols-outlined text-[18px]">repeat</span>
          </button>
        </div>
        
        <div className="w-full flex items-center gap-2 hidden md:flex">
          <span className="font-label-sm text-label-sm text-outline dark:text-gray-500">02:45</span>
          <div className="flex-1 bg-surface-container-high dark:bg-white/10 h-1.5 rounded-full overflow-hidden cursor-pointer">
            <div className="bg-primary dark:bg-google-purple h-full rounded-full" style={{ width: '53%' }}></div>
          </div>
          <span className="font-label-sm text-label-sm text-outline dark:text-gray-500">05:12</span>
        </div>
      </div>
      
      {/* Right: Volume & Options */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-2">
          <span className="material-symbols-outlined text-outline dark:text-gray-400 text-[18px]">volume_up</span>
          <div className="w-16 bg-surface-container-high dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-on-surface dark:bg-white h-full rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-surface-container dark:bg-white/10 text-on-surface dark:text-gray-300 font-label-sm text-label-sm">1.0x</span>
        <span className="material-symbols-outlined text-primary dark:text-google-purple text-[20px] hidden sm:block">equalizer</span>
      </div>
    </div>
  );
}
