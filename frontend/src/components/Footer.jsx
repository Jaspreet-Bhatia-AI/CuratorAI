import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-black/10 dark:border-white/10 bg-google-dark py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} JB AI Technologies. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="https://github.com/Jaspreet-Bhatia-AI" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-slate-900 dark:text-white transition-colors">GitHub</a>
          <a href="https://linkedin.com/in/jaspreet-bhatia-ai" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-slate-900 dark:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
