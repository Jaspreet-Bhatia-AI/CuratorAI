import React from 'react';
import MediaGrid from '../components/MediaGrid';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { roadmap, curriculum, isLoading, selectedTopic } = useAppContext();

  return (
    <div className="flex flex-col w-full h-full pb-20">
      
      {/* Breadcrumb & Top Context */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-on-surface-variant dark:text-gray-400 font-label-md text-label-md">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">school</span>
            <span>Curriculums</span>
          </span>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span>{roadmap?.title || "Welcome"}</span>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span className="text-primary dark:text-google-purple font-semibold px-2 py-0.5 rounded-md bg-surface-container dark:bg-google-purple/10">
            {selectedTopic || "Overview"}
          </span>
        </nav>
        
        {isLoading && (
          <div className="flex items-center gap-2 bg-surface-container-lowest dark:bg-white/5 px-3 py-1.5 rounded-full shadow-sm border border-outline-variant dark:border-white/10">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-gray-300">Live Latent Compute Engine: <strong className="text-on-surface dark:text-white">Synthesizing...</strong></span>
          </div>
        )}
      </div>

      {/* Chapter Headline & Meta Synthesis Banner */}
      <div className="relative overflow-hidden bg-surface-container-lowest dark:bg-google-surface/60 rounded-2xl shadow-sm border border-surface-container-highest dark:border-white/10 p-6 md:p-8 mb-8">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container dark:bg-google-purple/20 mb-3">
              <span className="material-symbols-outlined text-secondary dark:text-google-purple text-[16px]">auto_awesome</span>
              <span className="font-label-sm text-label-sm text-secondary dark:text-google-purple uppercase tracking-wider">
                {roadmap ? "Neural Synthesis Complete" : "Ready to Generate"}
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-white tracking-tight mb-2">
              {selectedTopic || "Search above to generate a curriculum"}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-gray-400 max-w-2xl leading-relaxed">
              {roadmap ? "Explore curated AI video generations, motion vector analysis, and procedural tracks." : "Type a topic like 'Latent Diffusion Models' or '90s Pop' in the search bar to start your journey."}
            </p>
          </div>
          
          {/* Chapter Quick Stats Ring */}
          {roadmap && (
            <div className="flex items-center gap-4 bg-surface-container-low/70 dark:bg-black/30 backdrop-blur-sm p-4 rounded-xl shrink-0 border border-surface-container-highest dark:border-white/5">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle className="text-surface-container-high dark:text-white/10" cx="24" cy="24" fill="none" r="20" stroke="currentColor" strokeWidth="4"></circle>
                  <circle className="text-primary dark:text-google-purple" cx="24" cy="24" fill="none" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset="35.1" strokeLinecap="round" strokeWidth="4"></circle>
                </svg>
                <span className="absolute font-label-sm text-label-sm text-on-surface dark:text-white font-bold">72%</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface dark:text-gray-200">{curriculum.length} Curated Seeds</span>
                <span className="font-body-sm text-body-sm text-outline dark:text-gray-500">ProRes & Raw Tensors</span>
              </div>
            </div>
          )}
        </div>

        {/* Action & Filter Bar */}
        {roadmap && (
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-4 border-t border-surface-container-highest dark:border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <button className="px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-on-surface text-surface-container-lowest dark:bg-white dark:text-black shadow-sm transition-all hover:opacity-90">All Generations</button>
              <button className="px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-surface-container-lowest dark:bg-white/5 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high transition-all shadow-sm border border-surface-container-highest dark:border-white/10">4K Upscaled</button>
              <button className="px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-surface-container-lowest dark:bg-white/5 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high transition-all shadow-sm border border-surface-container-highest dark:border-white/10">Interpolated 60fps</button>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 bg-surface-container-lowest dark:bg-white/10 text-on-surface dark:text-white hover:bg-surface-container-high dark:hover:bg-white/20 font-label-md text-label-md px-4 py-2 rounded-xl shadow-sm transition-all border border-surface-container-highest dark:border-transparent">
                <span className="material-symbols-outlined text-[18px] text-primary dark:text-google-purple">download</span>
                <span>Batch Download All</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Video Cards Grid */}
      <MediaGrid items={curriculum} />

    </div>
  );
}
