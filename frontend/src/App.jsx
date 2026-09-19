import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Studio from './pages/Studio';
import History from './pages/History';
import Library from './pages/Library';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Profile from "./pages/Profile";
import { AuthProvider } from './context/AuthContext';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import Onboarding from './components/Onboarding';
import FloatingPlayer from './components/FloatingPlayer';
import InteractiveGrid from './components/InteractiveGrid';

function LayoutEngine() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen flex flex-col selection:bg-primary/30 transition-colors duration-300">
      <Navbar isHome={isHome} toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      
      {!isHome && (
        <>
          <Sidebar isOpen={isMobileMenuOpen} closeMenu={() => setIsMobileMenuOpen(false)} />
          {/* Mobile Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <div 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
              />
            )}
          </AnimatePresence>
        </>
      )}
      
      <div className={`${!isHome ? 'md:pl-64' : ''}`}>
        <main className={`w-full pt-16 min-h-screen ${isHome ? '' : 'bg-background'}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>              <Route path="/" element={<Home />} />
              <Route path="/studio" element={<Navigate to="/" replace />} />
              <Route path="/roadmap" element={<Navigate to="/" replace />} />
              
              <Route path="/profile" element={<Profile />} />
              <Route path="/library" element={<Library />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      
      <InteractiveGrid />
      <FloatingPlayer />
      
      <SettingsModal />
      <AuthModal />
      <ProfileModal />
      <Onboarding />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Toaster position="bottom-right" toastOptions={{ style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } }} />
          <LayoutEngine />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
