import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { roadmap, selectedTopic, setSelectedTopic, isLoading } = useAppContext();

  // If there's no roadmap yet, we can render a skeleton or placeholder
  if (isLoading) {
    return (
      <aside className="fixed left-0 top-16 bottom-0 w-72 bg-surface-container-low/70 backdrop-blur-xl z-30 hidden md:flex flex-col justify-between p-4 overflow-y-auto border-r border-surface-container-highest">
         <div className="animate-pulse space-y-4">
           <div className="h-20 bg-surface-container-lowest rounded-xl"></div>
           <div className="h-64 bg-surface-container-highest rounded-xl"></div>
         </div>
      </aside>
    );
  }

  // Calculate some fun fake progress for the Stitch UI
  const totalSteps = roadmap?.roadmap_overview?.length || 7;
  const currentStep = roadmap?.roadmap_overview?.findIndex(s => {
      const title = typeof s === 'string' ? s : s.main_topic;
      return title === selectedTopic;
  }) || 0;
  
  const percentage = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-72 bg-surface-container-low/70 dark:bg-google-surface/60 dark:border-white/10 backdrop-blur-xl z-30 hidden md:flex flex-col justify-between p-4 overflow-y-auto border-r border-surface-container-highest">
      <div className="flex flex-col gap-4">
        {/* Roadmap Progress Widget */}
        <div className="p-3 bg-surface-container-lowest dark:bg-black/20 rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-label-md text-label-md text-on-surface dark:text-gray-200">{roadmap?.title || "Syllabus"}</span>
            <span className="font-label-sm text-label-sm text-primary font-semibold">{percentage}%</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1.5">{currentStep + 1} of {totalSteps} Chapters</p>
        </div>

        {/* Chapters List */}
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider px-1 mb-2">Curriculum Chapters</span>
          <nav className="flex flex-col gap-1">
            {roadmap?.roadmap_overview ? roadmap.roadmap_overview.map((step, index) => {
              const title = typeof step === 'string' ? step : step.main_topic;
              const isSelected = selectedTopic === title;
              const isPast = index <= currentStep;
              
              return (
                <button 
                  key={index}
                  onClick={() => setSelectedTopic(title)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-label-md text-label-md transition-all text-left ${isSelected ? 'bg-surface-container-highest text-on-surface dark:bg-google-purple/20 dark:text-google-purple font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-white/5 hover:text-on-surface'}`}
                >
                  <span className="truncate pr-2">{index + 1}. {title}</span>
                  <span className={`material-symbols-outlined text-[16px] shrink-0 ${isSelected ? 'text-primary' : (isPast ? 'text-secondary' : 'text-outline')}`}>
                    {isSelected ? 'play_arrow' : (isPast ? 'check_circle' : 'lock')}
                  </span>
                </button>
              );
            }) : (
              <div className="text-sm text-outline px-1">Search to generate a syllabus.</div>
            )}
          </nav>
        </div>
      </div>

      <div className="p-3 bg-surface-container-highest dark:bg-black/20 rounded-xl flex flex-col gap-1.5 mt-6">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface dark:text-gray-300">Curator Pro Tier</span>
          <span className="bg-secondary text-on-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full">Active</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-500">Unlimited compute & multi-stream stems</p>
      </div>
    </aside>
  );
}
