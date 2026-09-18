import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, loginWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password, isSignUp, name);
    } catch (error) {
      // Error is handled in context
    }
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-md" 
            onClick={() => setIsLoginModalOpen(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border border-outline-variant/30 p-8"
          >
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex flex-col items-center mb-8">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }}
                className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mb-4"
              >
                <span className="material-symbols-outlined text-primary text-[28px]">lock</span>
              </motion.div>
              <h2 className="font-headline-md text-headline-md text-on-surface text-center">
                {isSignUp ? "Create an Account" : "Welcome Back"}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {isSignUp ? "Join Curator AI to save your learning paths." : "Sign in to continue your journey."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-1.5 overflow-hidden"
                  >
                    <label className="font-label-sm text-label-sm text-on-surface">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                      placeholder="Jaspreet Bhatia"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="hello@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface flex justify-between">
                  <span>Password</span>
                  {!isSignUp && (
                    <button 
                      type="button" 
                      onClick={async () => {
                        if (!email) return toast.error("Please enter your email first");
                        await resetPassword(email);
                      }} 
                      className="text-primary hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-on-primary font-label-lg rounded-xl py-3 mt-2 shadow-sm transition-colors"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </motion.button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-outline-variant/50 flex-1"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">OR</span>
              <div className="h-px bg-outline-variant/50 flex-1"></div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loginWithGoogle}
              type="button" 
              className="w-full bg-surface-container border border-outline-variant hover:bg-surface-container-high text-on-surface font-label-md rounded-xl py-3 flex items-center justify-center gap-3 transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </motion.button>

            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-6">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-semibold hover:underline cursor-pointer">
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
