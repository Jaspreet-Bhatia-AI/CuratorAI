import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

export default function FloatingPlayer() {
  const { currentTrack, isPlaying, togglePlay } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(cur);
      setDuration(dur);
      if (dur > 0) {
        setProgress((cur / dur) * 100);
      }
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * duration;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-6 inset-x-0 mx-auto w-11/12 max-w-5xl z-50">
      {currentTrack.source === 'server' && (
        <audio 
          ref={audioRef} 
          src={`/api/stream/${encodeURIComponent(currentTrack.filename)}`} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => togglePlay()}
        />
      )}
      
      <div className="bg-surface-container-lowest/85 backdrop-blur-2xl shadow-[0_20px_45px_-10px_rgba(15,23,42,0.18)] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Section */}
        <div className="flex items-center gap-4 w-full md:w-1/3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md bg-gradient-to-br from-primary via-secondary to-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[24px]">graphic_eq</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-on-surface font-semibold truncate" title={currentTrack.filename}>
              {currentTrack.filename.replace('.mp3', '')}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
              {currentTrack.size} • {currentTrack.category}
            </span>
          </div>
          <button className="text-on-surface-variant hover:text-secondary transition-colors shrink-0 ml-auto md:ml-2">
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>
        </div>
        
        {/* Center Section (Controls) */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-5/12">
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full">
              <span className="material-symbols-outlined text-[18px]">shuffle</span>
            </button>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center p-1 rounded-full">
              <span className="material-symbols-outlined text-[22px]">skip_previous</span>
            </button>
            <button 
              onClick={togglePlay}
              className="bg-gradient-to-r from-primary to-secondary text-on-primary w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
            </button>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center p-1 rounded-full">
              <span className="material-symbols-outlined text-[22px]">skip_next</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full">
              <span className="material-symbols-outlined text-[18px]">repeat</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-mono w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden relative cursor-pointer group" onClick={handleSeek}>
              <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full relative" style={{ width: `${progress}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-surface-container-lowest rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-mono w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center justify-end gap-4 w-full md:w-1/3">
          {isPlaying && (
            <div className="flex items-center gap-1 h-5 px-1">
              <span className="w-1 bg-primary rounded-full h-3 animate-pulse"></span>
              <span className="w-1 bg-secondary rounded-full h-5 animate-pulse" style={{animationDelay:'0.1s'}}></span>
              <span className="w-1 bg-primary-container rounded-full h-2 animate-pulse" style={{animationDelay:'0.2s'}}></span>
            </div>
          )}
          <button className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-semibold transition-colors">
            1.0x
          </button>
          <div className="flex items-center gap-1">
            <button className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">volume_up</span>
            </button>
            <div className="w-16 h-1 bg-surface-container-high rounded-full overflow-hidden cursor-pointer relative group">
              <div className="bg-on-surface-variant group-hover:bg-primary h-full rounded-full transition-colors" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
