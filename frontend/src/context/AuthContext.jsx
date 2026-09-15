import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // AI Provider Settings
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [aiConfig, setAiConfig] = useState({
    provider: 'gemini', // 'gemini' or 'groq'
    key: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('curator_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCredits(5);
    }
        const savedTheme = localStorage.getItem('curator_theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    const savedConfig = localStorage.getItem('curator_ai_config');
    if (savedConfig) {
      setAiConfig(JSON.parse(savedConfig));
    }
  }, []);

    const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('curator_theme', newMode ? 'dark' : 'light');
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  const saveAiConfig = (config) => {
    setAiConfig(config);
    localStorage.setItem('curator_ai_config', JSON.stringify(config));
  };

  const loginWithGoogle = () => {
    const dummyUser = { id: 1, name: 'Guest User', email: 'guest@example.com', avatar: 'https://ui-avatars.com/api/?name=Guest+User&background=0D8ABC&color=fff' };
    setUser(dummyUser);
    setCredits(5);
    localStorage.setItem('curator_user', JSON.stringify(dummyUser));
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setCredits(0);
    localStorage.removeItem('curator_user');
  };

  const deductCredit = () => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, credits, loginWithGoogle, logout, deductCredit, 
      isLoginModalOpen, setIsLoginModalOpen,
      isSettingsModalOpen, setIsSettingsModalOpen,
      isDarkMode, toggleTheme,
      aiConfig, saveAiConfig
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
