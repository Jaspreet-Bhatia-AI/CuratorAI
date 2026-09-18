import React, { useContext, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import MediaGrid from '../components/MediaGrid';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

export default function Studio() {
  const { roadmap, searchQuery, isGenerating } = useAppContext();
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All Media');
  const [isMusicMode, setIsMusicMode] = useState(false);






  const [fetchedVideos, setFetchedVideos] = useState([]);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);
  const prevRoadmap = React.useRef(null);

  React.useEffect(() => {
    if (!roadmap?.curriculum || roadmap.curriculum.length === 0) return;
    if (prevRoadmap.current === roadmap) return; 

    const fetchVideos = async () => {
      setIsFetchingVideos(true);
      setFetchedVideos([]); 
      
      const results = [];
      for (const item of roadmap.curriculum) {
        try {
          const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ search_query: item.search_query, type: roadmap.type || 'education' })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.data) {
              results.push({ ...data.data, original_item: item });
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      setFetchedVideos(results);
      setIsFetchingVideos(false);
    };

    fetchVideos();
    prevRoadmap.current = roadmap;
  }, [roadmap]);
  const displayItems = fetchedVideos;

  const currentChapterText = roadmap?.roadmap_overview?.[activeChapter]?.main_topic || roadmap?.roadmap_overview?.[activeChapter]?.title || `Chapter ${activeChapter + 1}`;

  const totalModules = roadmap?.roadmap_overview?.length || 0;
  const currentModule = totalModules > 0 ? activeChapter + 1 : 0;
  const progressPercentage = totalModules > 0 ? Math.round((currentModule / totalModules) * 100) : 0;
  const strokeDashoffset = 125.6 - (125.6 * progressPercentage / 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="w-full p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      
      {/* INNER SIDEBAR: The Syllabus Navigator */}
      <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4 bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
        
        {/* Curriculum Progress Card */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low">
          <div className="relative flex items-center justify-center w-14 h-14 flex-shrink-0">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 48 48">
              <circle className="text-surface-container-high" cx="24" cy="24" fill="transparent" r="20" strokeWidth="4"></circle>
              <circle className="text-primary transition-all duration-700" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="4"></circle>
            </svg>
            <span className="absolute font-label-md text-label-md text-on-surface">{progressPercentage}%</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider truncate">Roadmap Progress</span>
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">
              {currentModule}/{totalModules} Milestones
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5 truncate" title={searchQuery || 'Pending Generation'}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-secondary"></span> 
              <span className="truncate">Track: {searchQuery || 'Pending Generation'}</span>
            </span>
          </div>
        </div>

        {/* Mode Switcher Pill */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container cursor-pointer" onClick={() => setIsMusicMode(!isMusicMode)}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">{isMusicMode ? 'school' : 'queue_music'}</span>
            <span className="font-label-md text-label-md text-on-surface">Switch to {isMusicMode ? 'Learning' : 'Music'} Mode</span>
          </div>
          <button aria-label="Toggle Mode" className="w-9 h-5 rounded-full bg-primary relative p-0.5 transition-colors focus:outline-none">
            <div className={`w-4 h-4 rounded-full bg-on-primary shadow-sm transform transition-transform ${isMusicMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* Syllabus Chapters List */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="px-2 pb-1 flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Modules</span>
          </div>

          {(roadmap?.roadmap_overview || []).map((mod, idx) => {
            const isActive = idx === activeChapter;
            return (
              <div 
                key={idx} 
                onClick={() => setActiveChapter(idx)}
                className={`cursor-pointer relative flex items-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-surface-container-high shadow-sm' : 'hover:bg-surface-container-low opacity-75'}`}
              >
                {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"></span>}
                <span className={`material-symbols-outlined text-[20px] mt-0.5 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {isActive ? 'play_circle' : 'radio_button_unchecked'}
                </span>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-label-sm text-label-sm ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>Chapter {idx + 1}</span>
                    {isActive && <span className="px-1.5 py-0.2 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase">Active</span>}
                  </div>
                  <span className={`font-body-sm text-body-sm truncate ${isActive ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                    {mod.main_topic || mod.title || `Module ${idx + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* MAIN CONTENT AREA: The Studio Grid */}
      <section className="flex-1 flex flex-col gap-6 w-full min-w-0">
        
        {/* Topic Banner & Header */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 lg:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-surface-container-high blur-3xl pointer-events-none opacity-60"></div>
          
          <div className="relative flex flex-col gap-1 z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">Chapter {activeChapter + 1}</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {searchQuery || currentChapterText}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Curated learning videos and study materials to master this module.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => {
                const topicToGenerate = roadmap?.roadmap_overview?.[activeChapter]?.main_topic || searchQuery;
                if (topicToGenerate) {
                  handleSearch(topicToGenerate);
                } else {
                  toast.error("Please search for a topic first.");
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:opacity-95 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Generate Module</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['All Media', 'Videos', 'Articles', 'Audio'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all ${
                  activeFilter === filter 
                    ? 'bg-on-surface text-background' 
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        
        {/* The Media Grid */}
        {isFetchingVideos ? (
          <div className="flex flex-col items-center justify-center p-12 gap-4">
            <svg className="animate-spin h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-label-lg text-label-lg text-on-surface-variant animate-pulse">Curating perfect videos from YouTube...</span>
          </div>
        ) : (
          <MediaGrid items={displayItems} />
        )}


      </section>
    </motion.div>
  );
}
