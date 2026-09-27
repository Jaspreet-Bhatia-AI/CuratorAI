import { supabase } from './supabase';

/**
 * Ensures the user exists in the public.users table.
 * If the user logs in with Google, this function syncs their email/name to our public table.
 */
export const syncUserProfile = async (user) => {
  if (!user) return;
  
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();
      
    // If user doesn't exist in our public.users table yet, insert them
    if (checkError && checkError.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}&mouth=smile,twinkle`,
            created_at: new Date().toISOString(),
          }
        ]);
        
      if (insertError) {
      }
    }
  } catch (error) {
  }
};
