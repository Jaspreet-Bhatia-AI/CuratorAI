import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsModal() {
  const { isSettingsModalOpen, setIsSettingsModalOpen, aiConfig, saveAiConfig } = useAuth();
  
  const [provider, setProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (isSettingsModalOpen) {
      setProvider(aiConfig.provider || 'gemini');
      setApiKey(aiConfig.key || '');
    }
  }, [isSettingsModalOpen, aiConfig]);

  if (!isSettingsModalOpen) return null;

  const handleSave = () => {
    saveAiConfig({ provider, key: apiKey });
    toast.success("AI Configuration Saved!");
    setIsSettingsModalOpen(false);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[60] flex items-center justify-center bg-surface dark:bg-slate-950/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-surface-container-lowest dark:bg-slate-900 border border-surface-container-highest dark:border-slate-700/50 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-xl w-full relative overflow-hidden"
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
        >
          <button 
            onClick={() => setIsSettingsModalOpen(false)}
            className="absolute top-4 right-4 text-outline dark:text-slate-400 hover:text-on-surface dark:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-on-surface dark:text-white mb-2 tracking-tight">AI Settings</h2>
          <p className="text-outline dark:text-slate-400 text-sm mb-6">Connect your own AI to power Curriculum Roadmaps for free.</p>

          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setProvider('gemini')}
              className={`flex-1 py-3 px-4 rounded-xl border ${provider === 'gemini' ? 'bg-primary/10 border-blue-500 text-primary' : 'bg-surface-container-low dark:bg-slate-800 border-surface-container-highest dark:border-slate-700 text-outline dark:text-slate-400'} font-semibold transition-all`}
            >
              Google Gemini
            </button>
            <button 
              onClick={() => setProvider('groq')}
              className={`flex-1 py-3 px-4 rounded-xl border ${provider === 'groq' ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'bg-surface-container-low dark:bg-slate-800 border-surface-container-highest dark:border-slate-700 text-outline dark:text-slate-400'} font-semibold transition-all`}
            >
              Groq (Fast)
            </button>
          </div>

          <div className="bg-surface-container-low dark:bg-slate-800/50 border border-surface-container-highest dark:border-slate-700 rounded-xl p-4 mb-6">
            <h3 className="text-on-surface dark:text-white font-medium mb-2">How to get your free key:</h3>
            {provider === 'gemini' ? (
              <ol className="list-decimal pl-4 text-sm text-on-surface-variant dark:text-slate-300 space-y-1">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-primary hover:underline">Google AI Studio</a></li>
                <li>Sign in with your standard Google account</li>
                <li>Click <b>"Create API Key"</b></li>
                <li>Paste the key below</li>
              </ol>
            ) : (
              <ol className="list-decimal pl-4 text-sm text-on-surface-variant dark:text-slate-300 space-y-1">
                <li>Go to <a href="https://console.groq.com/keys" target="_blank" className="text-orange-400 hover:underline">Groq Console</a></li>
                <li>Create a free developer account</li>
                <li>Click <b>"Create API Key"</b></li>
                <li>Paste the key below</li>
              </ol>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-outline dark:text-slate-400 mb-2">Your API Key</label>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your key here..."
              className="w-full bg-surface dark:bg-slate-950 border border-surface-container-highest dark:border-slate-700 rounded-lg px-4 py-3 text-on-surface dark:text-white focus:outline-none focus:border-google-purple transition-colors"
            />
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-surface-container-lowest text-on-surface font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Save Configuration
          </button>
          
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
