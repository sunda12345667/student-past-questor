
// Re-export the auth context plus additional auth-related hooks
import { useAuth as useAuthContext, User } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = useAuthContext;

// Hook to handle authentication requirements with redirects
export const useRequireAuth = (redirectTo: string = '/auth') => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        toast.error('Please log in to access this page');
        navigate(redirectTo);
      }
      setIsCheckingAuth(false);
    }
  }, [currentUser, isLoading, navigate, redirectTo]);

  return { user: currentUser, isLoading: isLoading || isCheckingAuth };
};

// Hook to check if user has admin privileges
export const useIsAdmin = () => {
  const { isAdmin, currentUser } = useAuth();
  return { isAdmin: isAdmin(), isAuthenticated: !!currentUser };
};

// Handle user authentication with Supabase
export const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast.error(error.message);
      return false;
    }
    
    if (data.user) {
      toast.success('Successfully signed in');
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error('Sign in error:', error);
    toast.error('An error occurred during sign in');
    return false;
  }
};

// Sign up a new user
export const signUpWithEmail = async (email: string, password: string, name: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/dashboard`
      },
    });
    
    if (error) {
      toast.error(error.message);
      return false;
    }
    
    if (data.user) {
      toast.success('Account created successfully! You can now log in.');
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error('Sign up error:', error);
    toast.error('An error occurred during sign up');
    return false;
  }
};

// Sign out current user
export const signOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      return false;
    }
    
    toast.success('Successfully signed out');
    return true;
  } catch (error: any) {
    console.error('Sign out error:', error);
    toast.error('An error occurred during sign out');
    return false;
  }
};

// Hook for profile management
export const useProfile = () => {
  const { currentUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (profileData: Partial<User>) => {
    if (!currentUser) return false;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', currentUser.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile: currentUser,
    isUpdating,
    updateProfile
  };
};
