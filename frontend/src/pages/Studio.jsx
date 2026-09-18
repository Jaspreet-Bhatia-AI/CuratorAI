import React, { useContext, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import MediaGrid from '../components/MediaGrid';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

export default function Studio() {
  const { roadmap, searchQuery, isLoading } = useAppContext();
  const [activeChapter, setActiveChapter] = useState(0);
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
      
      const promises = roadmap.curriculum.map(async (item) => {
        try {
          const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ search_query: item.search_query, type: roadmap.type || 'education' })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.data) {
              // As soon as this one finishes, instantly append it to the grid!
              setFetchedVideos(prev => {
                if (prev.some(v => v.url === data.data.url)) return prev;
                return [...prev, { ...data.data, original_item: item }];
              });
            }
          }
        } catch (e) {
          console.error(e);
        }
      });
      
      // Wait for all concurrent fetches to complete
      await Promise.all(promises);
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
      {/* LEFT SIDEBAR: Playlist / Overview */}
      <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4 bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/30 sticky top-24 self-start">
        <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
          <span className="material-symbols-outlined text-primary text-[24px]">
            {roadmap?.type === 'music' ? 'queue_music' : 'format_list_bulleted'}
          </span>
          <h2 className="font-title-md text-title-md text-on-surface font-bold">
            {roadmap?.title || 'Curated List'}
          </h2>
        </div>
        
        <div className="flex flex-col gap-4 mt-1 overflow-y-auto max-h-[calc(100vh-16rem)] pr-2">
          {(roadmap?.roadmap_overview || []).map((mod, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider">
                {mod.main_topic || mod.title || `Section ${idx + 1}`}
              </h3>
              {mod.sub_topics && mod.sub_topics.length > 0 && (
                <ul className="flex flex-col gap-2 border-l-2 border-surface-container-highest ml-1.5 pl-3">
                  {mod.sub_topics.map((sub, sIdx) => (
                    <li key={sIdx} className="font-body-sm text-body-sm text-on-surface-variant flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary/60 mt-1.5 shrink-0"></span>
                      <span className="leading-snug">{sub}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {(!roadmap?.roadmap_overview || roadmap.roadmap_overview.length === 0) && (
            <div className="text-on-surface-variant font-body-sm text-body-sm italic opacity-75">
              Generating list structure...
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA: The Studio Grid */}

      <section className="flex-1 flex flex-col gap-6 w-full min-w-0">
        {/* Topic Banner & Header */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 lg:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-surface-container-high blur-3xl pointer-events-none opacity-60"></div>
          
          <div className="relative flex flex-col gap-1 z-10">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {searchQuery || "Search Results"}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Curated top matches for your query.
            </p>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        {(isLoading || isFetchingVideos) && (
          <div className="w-full flex flex-col gap-2 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary animate-spin" style={{ animationDuration: '2s' }}>
                  {isLoading ? 'psychiatry' : 'radar'}
                </span>
                <span className="font-label-md text-on-surface">
                  {isLoading 
                    ? "AI is structuring your results..." 
                    : `Fetching media... (${fetchedVideos.length}/${roadmap?.curriculum?.length || 0})`}
                </span>
              </div>
              <span className="font-label-sm text-primary font-bold">
                {isLoading ? "Generating" : `${Math.round((fetchedVideos.length / (roadmap?.curriculum?.length || 1)) * 100)}%`}
              </span>
            </div>
            
            <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden relative">
              {/* Indeterminate pulsing background when generating */}
              {isLoading && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              )}
              
              {/* Determinate bar when fetching */}
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-secondary relative z-10"
                initial={{ width: "0%" }}
                animate={{ width: isLoading ? "25%" : `${25 + (75 * (fetchedVideos.length / (roadmap?.curriculum?.length || 1)))}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* The Media Grid */}

        <MediaGrid items={displayItems} />


      </section>
    </motion.div>
  );
}
