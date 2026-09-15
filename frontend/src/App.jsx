import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
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

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/library" element={<Library />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="bg-surface dark:bg-google-dark text-on-surface dark:text-gray-200 font-sans min-h-screen flex flex-col selection:bg-google-purple/30 transition-colors duration-300">
            <Toaster position="bottom-right" toastOptions={{ style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } }} />
            
            <Navbar />
            <Sidebar />
            <PwaUpdater />
            <Onboarding />
            <LoginModal />
            <SettingsModal />
            
            <div className="md:pl-72">
              <main className="w-full pt-16 pb-28 px-4 md:px-8 bg-surface dark:bg-google-dark min-h-screen">
                <AnimatedRoutes />
              </main>
            </div>
            
            {/* The new Stitch floating player */}
            <FloatingPlayer />
          </div>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
