import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';

export default function History() {
  const { user } = useAuth();
  const { setRoadmap, setSearchQuery } = useAppContext();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    supabase
      .from('user_history')
      .select('*')
      .eq('user_email', user.email)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        setHistory(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const handleRestore = (item) => {
    setSearchQuery(item.query);
    setRoadmap(item.roadmap);
    navigate('/studio');
  };

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-6xl text-primary/40">lock</span>
        <h2 className="text-headline-md text-on-surface">Sign In Required</h2>
        <p className="text-on-surface-variant">Please log in to view your search history.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24 pb-20">
      <div className="mb-8 flex items-center gap-4">
        <span className="material-symbols-outlined text-4xl text-primary">history</span>
        <div>
          <h1 className="text-display-sm text-on-surface font-bold">Your History</h1>
          <p className="text-on-surface-variant text-body-lg">Access all your previous AI curations.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-12 text-center border border-outline-variant/30">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/50 mb-4">search_off</span>
          <h3 className="text-headline-sm text-on-surface">No History Found</h3>
          <p className="text-on-surface-variant mt-2">You haven't generated any curations yet!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
            >
              <div>
                <h3 className="font-headline-sm text-on-surface capitalize">{item.query}</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  {new Date(item.created_at + 'Z').toLocaleString()} • {item.roadmap.curriculum.length} items
                </p>
              </div>
              <button 
                onClick={() => handleRestore(item)}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">restore</span>
                Open
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
