import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLibrarySongs, saveSongToLibrary, removeSongFromLibrary } from '../utils/db';
import toast from 'react-hot-toast';

export default function Library() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    loadLibrary();
    
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      playNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []);

  const loadLibrary = async () => {
    try {
      const storedSongs = await getLibrarySongs();
      setSongs(storedSongs);
    } catch (err) {
      console.error("Failed to load library", err);
    }
  };

  // Demo function to add a fake song so the user can see the UI working immediately
  const loadDemoSong = async () => {
    const demo = {
      id: 'demo-' + Date.now(),
      title: 'Neon Nights (Demo Track)',
      artist: 'Curator AI Beats',
      coverUrl: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=200&h=200&fit=crop',
      // In reality, this blob comes from our FastAPI backend's ZIP extraction
      // For demo, we just use an empty blob to prevent crashing (audio won't actually make sound)
      blob: new Blob([], { type: 'audio/mp3' }), 
      fake: true
    };
    await saveSongToLibrary(demo);
    toast.success("Demo track added to library!");
    loadLibrary();
  };

  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Load new song
    setCurrentSong(song);
    if (!song.fake) {
      const url = URL.createObjectURL(song.blob);
      audioRef.current.src = url;
    } else {
      audioRef.current.src = ""; // Empty for demo
    }
    
    audioRef.current.play().catch(() => {
      // Catch empty src error for demo
    });
    setIsPlaying(true);
  };

  const playNext = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  const deleteSong = async (e, id) => {
    e.stopPropagation(); // prevent playing
    await removeSongFromLibrary(id);
    if (currentSong?.id === id) {
      audioRef.current.pause();
      setCurrentSong(null);
      setIsPlaying(false);
    }
    toast.success("Removed from library");
    loadLibrary();
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-32 min-h-screen">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Your Library</h1>
          <p className="text-slate-400">Your offline collection, stored directly in this app.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={loadDemoSong} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700">
            + Add Demo Track
          </button>
          <button className="bg-gradient-to-r from-google-purple to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export ZIP
          </button>
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800/50">
          <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Your library is empty</h3>
          <p className="text-slate-400 max-w-md mx-auto">When you curate playlists, you can save songs here for offline listening without filling up your phone's download folder.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {songs.map((song, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={song.id}
              onClick={() => playSong(song)}
              className={`group flex items-center p-3 rounded-xl cursor-pointer transition-colors ${currentSong?.id === song.id ? 'bg-white/10 border border-white/20' : 'hover:bg-slate-800/50 border border-transparent'}`}
            >
              <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden relative flex-shrink-0">
                <img src={song.coverUrl} className="w-full h-full object-cover" alt="cover" />
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${currentSong?.id === song.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                  {currentSong?.id === song.id && isPlaying ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  )}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className={`font-medium ${currentSong?.id === song.id ? 'text-google-purple' : 'text-white'}`}>{song.title}</h4>
                <p className="text-sm text-slate-400">{song.artist}</p>
              </div>
              <button 
                onClick={(e) => deleteSong(e, song.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Audio Player */}
      <AnimatePresence>
        {currentSong && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-6 py-4"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
              
              {/* Now Playing Info */}
              <div className="flex items-center gap-4 w-1/4">
                <img src={currentSong.coverUrl} className="w-14 h-14 rounded-md shadow-lg" alt="cover" />
                <div className="overflow-hidden">
                  <h4 className="text-white font-medium truncate">{currentSong.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{currentSong.artist}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center flex-1 max-w-2xl">
                <div className="flex items-center gap-6 mb-2">
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                  </button>
                  <button 
                    onClick={() => playSong(currentSong)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  >
                    {isPlaying ? (
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                  <button onClick={playNext} className="text-slate-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{formatTime(audioRef.current.currentTime)}</span>
                  <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                    <div 
                      className="h-full bg-gradient-to-r from-google-purple to-cyan-400 relative"
                      style={{ width: `${progress}%` }}
                    >
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_5px_#fff]"></div>
                    </div>
                  </div>
                  <span>{formatTime(audioRef.current.duration)}</span>
                </div>
              </div>

              {/* Extras (Volume, etc) */}
              <div className="w-1/4 flex justify-end">
                <button className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.236l5 5V3l-5 5H7a2 2 0 00-2 2z"></path></svg>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
