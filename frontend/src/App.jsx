import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Studio from './pages/Studio';
import Library from './pages/Library';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import LoginModal from './components/LoginModal';
import SettingsModal from './components/SettingsModal';
import PwaUpdater from './components/PwaUpdater';
import Onboarding from './components/Onboarding';
import FloatingPlayer from './components/FloatingPlayer';

function LayoutEngine() {
  const location = useLocation();
  const isZen = location.pathname === '/';

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen flex flex-col selection:bg-primary/30 transition-colors duration-300">
      <Navbar isZen={isZen} />
      {!isZen && <Sidebar />}
      
      <div className={`${!isZen ? 'md:pl-64' : ''}`}>
        <main className={`w-full pt-16 min-h-screen ${isZen ? '' : 'bg-background'}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/library" element={<Library />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      
      <FloatingPlayer />
      <SettingsModal />
      <LoginModal />
      <PwaUpdater />
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
