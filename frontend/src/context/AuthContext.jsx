import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // AI Provider Settings
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [aiConfig, setAiConfig] = useState({
    provider: 'gemini', 
    key: ''
  });

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
      setLoading(false);
    });

    // Listen for changes on auth state (login, signout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
      else setCredits(0);
    });

    // Load theme & AI config from local storage
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

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    // Placeholder for fetching user credits/metadata from your 'users' table
    // For now, give them 5 credits locally if logged in
    setCredits(5);
  };

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

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error.message || "Failed to login with Google");
    }
  };

  const loginWithEmail = async (email, password, isSignUp, name = '') => {
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || email}`
            }
          }
        });
        if (error) throw error;
        toast.success("Signup successful! Please check your email to verify.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Successfully logged in!");
        setIsLoginModalOpen(false);
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed");
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/profile`,
      });
      if (error) throw error;
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.message || "Failed to send reset email");
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });
      if (error) throw error;
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully logged out.");
      setIsProfileModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to logout");
    }
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
      user, credits, loading,
      loginWithGoogle, loginWithEmail, logout, deductCredit, 
      resetPassword, updateProfile,
      isLoginModalOpen, setIsLoginModalOpen,
      isProfileModalOpen, setIsProfileModalOpen,
      isSettingsModalOpen, setIsSettingsModalOpen,
      isDarkMode, toggleTheme,
      aiConfig, saveAiConfig
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
