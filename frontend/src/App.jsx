import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
        <AppProvider>
      <AuthProvider>
      <BrowserRouter>
      <div className="min-h-screen bg-google-dark text-gray-200 font-sans flex flex-col selection:bg-google-purple/30 selection:text-white">
        <Toaster position="bottom-right" toastOptions={{ style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } }} />
                <Navbar />
        <PwaUpdater />
        <LoginModal />
        <SettingsModal />
        <div className="flex-1 flex flex-col">
          <AnimatedRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
          </AuthProvider>
    </AppProvider>
  );
}

export default App;
