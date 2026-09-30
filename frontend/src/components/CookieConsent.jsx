import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('curator_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('curator_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const declineConsent = () => {
    // Strictly necessary only
    localStorage.setItem('curator_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-surface-container-high rounded-2xl shadow-2xl p-5 z-[100] border border-outline-variant/30"
          role="dialog"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
        >
          <h3 id="cookie-banner-title" className="font-title-md text-on-surface mb-2 font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">cookie</span>
            Your Privacy Choices
          </h3>
          <p id="cookie-banner-desc" className="font-body-sm text-on-surface-variant mb-4 leading-relaxed">
            We use strictly necessary cookies to keep you logged in and store your local app preferences (like your BYOK API Keys). We do not use third-party tracking cookies. 
            <Link to="/privacy" className="text-primary hover:underline ml-1 font-semibold" aria-label="Read our Privacy Policy">Learn more</Link>.
          </p>
          <div className="flex items-center gap-3 justify-end">
            <button 
              onClick={declineConsent}
              className="px-4 py-2 rounded-full font-label-md font-semibold text-on-surface-variant hover:bg-surface-container-highest transition-colors"
              aria-label="Decline optional cookies"
            >
              Essential Only
            </button>
            <button 
              onClick={acceptConsent}
              className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md font-semibold hover:shadow-md hover:opacity-90 transition-all"
              aria-label="Accept cookies"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
