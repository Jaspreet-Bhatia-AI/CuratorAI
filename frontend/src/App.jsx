import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import { AppProvider } from './context/AppContext';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
      <div className="min-h-screen bg-google-dark text-gray-200 font-sans flex flex-col selection:bg-google-purple/30 selection:text-white">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <AnimatedRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
    </AppProvider>
  );
}

export default App;
