import React, { useContext } from 'react';
import { useAppContext } from '../context/AppContext';
import MediaGrid from '../components/MediaGrid';

export default function Studio() {
  const { roadmap, searchQuery, isGenerating } = useAppContext();

  // Fallback items to show the layout if no API call was made
  const mockItems = [
    { title: 'Kinetic Fluidity in Volumetric Space', duration: '03:42', format: '4K UHD', thumbnail: 'https://picsum.photos/seed/kin/640/360' },
    { title: 'Procedural Drone Orbit & Trajectory', duration: '05:18', format: '60 FPS', thumbnail: 'https://picsum.photos/seed/dro/640/360' },
    { title: 'Bioluminescent Chrono-Flora Division', duration: '08:14', format: 'Cached', thumbnail: 'https://picsum.photos/seed/bio/640/360' },
    { title: 'Refractive Caustics Latent Manifold', duration: '02:19', format: 'ProRes', thumbnail: 'https://picsum.photos/seed/ref/640/360' },
    { title: 'Harmonic Spectral Resonance Waves', duration: '06:40', format: 'Stems', thumbnail: 'https://picsum.photos/seed/har/640/360' },
    { title: 'Neural Spline Coordinate Keyframes', duration: '04:02', format: '6-DoF', thumbnail: 'https://picsum.photos/seed/neu/640/360' },
  ];

  const displayItems = roadmap?.modules || mockItems;

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
      
      {/* INNER SIDEBAR: The Syllabus Navigator */}
      <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4 bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
        
        {/* Curriculum Progress Card */}
        <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low">
          <div className="relative flex items-center justify-center w-14 h-14 flex-shrink-0">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 48 48">
              <circle className="text-surface-container-high" cx="24" cy="24" fill="transparent" r="20" strokeWidth="4"></circle>
              <circle className="text-primary transition-all duration-700" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" strokeDasharray="125.6" strokeDashoffset="35.16" strokeLinecap="round" strokeWidth="4"></circle>
            </svg>
            <span className="absolute font-label-md text-label-md text-on-surface">72%</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider truncate">Curriculum Syllabus</span>
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">
              {roadmap?.modules?.length ? `0/${roadmap.modules.length} Milestones` : '5/7 Milestones'}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Track: {searchQuery || 'Neural Diffusion'}
            </span>
          </div>
        </div>

        {/* Mode Switcher Pill */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">queue_music</span>
            <span className="font-label-md text-label-md text-on-surface">Switch to Music Queue</span>
          </div>
          <button aria-label="Toggle Learning to Music Mode" className="w-9 h-5 rounded-full bg-primary relative p-0.5 transition-colors focus:outline-none">
            <div className="w-4 h-4 rounded-full bg-on-primary shadow-sm transform translate-x-4 transition-transform"></div>
          </button>
        </div>

        {/* Syllabus Chapters List */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="px-2 pb-1 flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm uppercase tracking-widest">Syllabus Structure</span>
            <span className="font-label-sm text-label-sm">v4.2</span>
          </div>

          {(roadmap?.modules || [1, 2, 3, 4]).map((mod, idx) => {
            const isActive = idx === 1;
            return (
              <div key={idx} className={`relative flex items-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-surface-container-high shadow-sm' : 'hover:bg-surface-container-low opacity-75'}`}>
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
                    {mod.title || `Module ${idx + 1}`}
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
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">Curriculum Level II</span>
              <span className="text-on-surface-variant font-label-sm text-label-sm">• Latent Systems</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {searchQuery || 'Latent Motion Vectors & Video Coherence'}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Curated interactive AI video generations, optical flow vectors, and procedural temporal stabilization tracks.
            </p>
          </div>
          
          <div className="relative z-10 flex items-center gap-2 flex-shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:opacity-95 transition-all">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Synthesize All</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-4 py-1.5 rounded-full bg-on-surface text-background font-label-md text-label-md transition-all">All Media</button>
            <button className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all">4K Video</button>
            <button className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all">Audio Stems</button>
            <button className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span>Saved Offline (3)</span>
            </button>
          </div>
        </div>

        {/* The Media Grid */}
        <MediaGrid items={displayItems} />

      </section>
    </div>
  );
}
