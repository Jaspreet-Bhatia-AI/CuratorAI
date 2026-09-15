import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { searchQuery, setSearchQuery } = useAppContext();
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (searchQuery.trim()) {
      navigate('/studio');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const selectPrompt = (promptText) => {
    setSearchQuery(promptText);
    navigate('/studio');
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-12 select-none">
      {/* Glowing Ambient Background Orbs */}
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/25 blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-1/3 -right-24 w-[30rem] h-[30rem] rounded-full bg-gradient-to-bl from-secondary-container/20 to-tertiary/20 blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute -bottom-24 left-1/3 w-[26rem] h-[26rem] rounded-full bg-gradient-to-t from-primary-container/20 to-surface-tint/15 blur-3xl pointer-events-none -z-10"></div>
      
      {/* Central Focus Stage */}
      <div className="w-full max-w-3xl flex flex-col items-center justify-center my-auto py-10 relative z-10">
        {/* Visual Tagline */}
        <div className="flex flex-col items-center text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary mb-1">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span className="font-label-md text-label-md">Infinite Knowledge & Sensory Synthesis</span>
          </div>
          <h1 className="font-display-lg text-display-lg sm:text-[56px] text-on-surface tracking-tight leading-none">
            Focus your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary">intellect.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto pt-1">
            Synthesize deep video curricula, algorithmic soundscapes, and cinematic visual feeds in one stroke.
          </p>
        </div>
        
        {/* Massive Glassmorphic Search Bar */}
        <div className="w-full relative group">
          <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-r from-primary/30 via-secondary/25 to-tertiary/30 blur-lg opacity-70 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative w-full rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center flex-1 w-full pl-2">
              <span className="material-symbols-outlined text-[24px] text-primary mr-2 select-none">explore</span>
              <input 
                className="w-full bg-transparent text-on-surface placeholder:text-outline font-body-lg text-body-lg focus:outline-none antialiased" 
                placeholder="What do you want to learn, listen to, or explore today?" 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 self-stretch sm:self-auto">
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-1 rounded-md bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm shadow-sm select-none">
                <span className="text-[12px]">⌘</span>K
              </kbd>
              <button 
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-gradient-to-r from-primary to-secondary text-on-primary font-label-lg text-label-lg shadow-xl shadow-primary/25 px-6 py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer" 
                type="button"
                onClick={handleGenerate}
              >
                <span>Generate</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Interactive Mode Segmented Toggle / Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1 p-1.5 rounded-2xl bg-surface-container-low/90 backdrop-blur-md shadow-inner max-w-full">
          <button className="flex items-center gap-1 px-4 py-1 rounded-xl transition-all cursor-pointer bg-surface-container-lowest text-primary shadow-md shadow-primary/10 font-label-md text-label-md">
            <span className="text-base">📚</span>
            <span>Learning</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary ml-1"></span>
          </button>
          <button className="flex items-center gap-1 px-4 py-1 rounded-xl transition-all cursor-pointer text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/60 font-label-md text-label-md">
            <span className="text-base">🎵</span>
            <span>Music</span>
          </button>
          <button className="flex items-center gap-1 px-4 py-1 rounded-xl transition-all cursor-pointer text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/60 font-label-md text-label-md">
            <span className="text-base">🍿</span>
            <span>Entertainment</span>
          </button>
          <button className="flex items-center gap-1 px-4 py-1 rounded-xl transition-all cursor-pointer text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/60 font-label-md text-label-md">
            <span className="text-base">✨</span>
            <span>Everything Else</span>
          </button>
        </div>
        
        {/* Curated Dynamic Presets */}
        <div className="mt-8 w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[14px] text-outline">trending_up</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Recommended syntheses</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 w-full">
            <button className="group flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm hover:shadow-md transition-all" onClick={() => selectPrompt('Latent Diffusion & Video Motion Dynamics')}>
              <span className="w-2 h-2 rounded-full bg-primary/70 group-hover:bg-primary transition-colors"></span>
              <span>Latent Diffusion & Video Motion Dynamics</span>
            </button>
            <button className="group flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm hover:shadow-md transition-all" onClick={() => selectPrompt('Bioluminescent Chrono-Flora Synth')}>
              <span className="w-2 h-2 rounded-full bg-tertiary/70 group-hover:bg-tertiary transition-colors"></span>
              <span>Bioluminescent Chrono-Flora Synth</span>
            </button>
            <button className="group flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm hover:shadow-md transition-all" onClick={() => selectPrompt('Lo-Fi Deep Tensor Beats')}>
              <span className="w-2 h-2 rounded-full bg-secondary/70 group-hover:bg-secondary transition-colors"></span>
              <span>Lo-Fi Deep Tensor Beats</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
