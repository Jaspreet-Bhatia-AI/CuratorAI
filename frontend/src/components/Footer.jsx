import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/30 bg-surface py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="Curator AI Home">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-[20px]" aria-hidden="true">model_training</span>
              </div>
              <span className="font-title-lg font-bold text-on-surface tracking-tight">Curator AI</span>
            </Link>
            <p className="font-body-md text-on-surface-variant max-w-sm leading-relaxed mb-4">
              Your personal AI-powered learning and media aggregation engine. Operating fully locally via BYOK (Bring Your Own Key) for ultimate privacy and control.
            </p>
            <div className="font-body-sm text-on-surface-variant/80">
              <p>Curator Technologies LLC</p>
              <p>San Francisco, CA 94105, USA</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-label-lg font-semibold text-on-surface mb-4">Legal & Compliance</h3>
            <ul className="space-y-3 font-body-sm text-on-surface-variant">
              <li><Link to="/privacy" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1 -mx-1" aria-label="Read Privacy Policy">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1 -mx-1" aria-label="Read Terms of Service">Terms & Conditions</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1 -mx-1" aria-label="Manage Cookie Preferences">Cookie Preferences</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-label-lg font-semibold text-on-surface mb-4">Resources</h3>
            <ul className="space-y-3 font-body-sm text-on-surface-variant">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1 -mx-1" aria-label="Visit our GitHub Repository">Open Source (GitHub)</a></li>
              <li><a href="#" className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1 -mx-1" aria-label="Contact Support">Contact Support</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-on-surface-variant/70">
          <p>&copy; {new Date().getFullYear()} Curator Technologies LLC. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <span className="material-symbols-outlined text-[16px] text-error" aria-hidden="true">favorite</span> for privacy-first users.
          </p>
        </div>
      </div>
    </footer>
  );
}
