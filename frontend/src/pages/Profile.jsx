import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile, resetPassword } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ full_name: fullName });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      await resetPassword(user.email);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Please sign in</h2>
        <p className="text-on-surface-variant mt-2">You need an account to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8 max-w-3xl mx-auto w-full gap-8">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Your Profile</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
          <img 
            src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full border-4 border-surface-container object-cover bg-surface-container-lowest shadow-sm"
          />
          <button className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm transition-colors border border-outline-variant/50">
            Change Avatar
          </button>
        </div>

        <div className="flex-1 w-full">
          <form onSubmit={handleUpdate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm text-on-surface">Email Address</label>
              <input 
                type="email" 
                disabled 
                value={user.email} 
                className="bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface-variant cursor-not-allowed"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm text-on-surface">Full Name</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-4 mt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-label-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Security</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
          We will send a secure link to your email address allowing you to choose a new password.
        </p>
        <div>
          <button 
            onClick={handlePasswordReset}
            disabled={loading}
            className="px-6 py-2.5 bg-surface-container text-on-surface border border-outline-variant/50 rounded-xl font-label-md hover:bg-surface-container-high transition-colors disabled:opacity-50"
          >
            Send Password Reset Email
          </button>
        </div>
      </div>
    </div>
  );
}
