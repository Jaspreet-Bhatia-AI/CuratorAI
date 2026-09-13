import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null means not logged in
  const [credits, setCredits] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Mock checking session on load (Will be replaced with Supabase getSession)
  useEffect(() => {
    const savedUser = localStorage.getItem('curator_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCredits(5); // Default free credits
    }
  }, []);

  const loginWithGoogle = () => {
    // Mock login for now
    const dummyUser = { id: 1, name: 'Guest User', email: 'guest@example.com', avatar: 'https://ui-avatars.com/api/?name=Guest+User' };
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
    <AuthContext.Provider value={{ user, credits, loginWithGoogle, logout, deductCredit, isLoginModalOpen, setIsLoginModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
