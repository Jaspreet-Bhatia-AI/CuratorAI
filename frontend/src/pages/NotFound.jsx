import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-12 rounded-3xl backdrop-blur-xl max-w-lg w-full shadow-2xl"
      >
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Lost in the Algorithm</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page or video roadmap you are looking for doesn't exist in our neural network. It might have been moved or deleted.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Return Home</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
