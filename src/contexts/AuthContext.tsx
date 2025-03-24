
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data from the profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      console.log('Profile data received:', data);
      return data as User;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Set up the auth state listener for Supabase
  useEffect(() => {
    console.log('Setting up auth state listener');
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession ? 'Session exists' : 'No session');
        
        if (!mounted) return;
        
        if (newSession) {
          setSession(newSession);
          try {
            const profileData = await fetchUserProfile(newSession.user.id);
            
            if (profileData) {
              console.log('Setting user from profile:', profileData);
              setCurrentUser(profileData);
            } else {
              // Fallback to session data if profile not found
              console.log('Profile not found, using session data');
              setCurrentUser({
                id: newSession.user.id,
                email: newSession.user.email || '',
                name: newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0] || '',
                role: newSession.user.user_metadata?.role || 'user',
              });
            }
          } catch (error) {
            console.error('Error setting user data after auth change:', error);
            // Still set user from session to avoid blocking the login
            setCurrentUser({
              id: newSession.user.id,
              email: newSession.user.email || '',
              name: newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0] || '',
              role: newSession.user.user_metadata?.role || 'user',
            });
          }
        } else {
          setSession(null);
          setCurrentUser(null);
        }
        
        if (mounted) setIsLoading(false);
      }
    );

    // THEN check for existing session
    const checkExistingSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Existing session check result:', currentSession ? 'Found' : 'Not found');
        
        if (!mounted) return;
        
        if (currentSession) {
          setSession(currentSession);
          try {
            const profileData = await fetchUserProfile(currentSession.user.id);
            
            if (profileData) {
              console.log('Setting user from existing session profile');
              setCurrentUser(profileData);
            } else {
              // Fallback to session data if profile not found
              console.log('Profile not found for existing session, using session data');
              setCurrentUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || '',
                role: currentSession.user.user_metadata?.role || 'user',
              });
            }
          } catch (error) {
            console.error('Error setting user from existing session:', error);
            // Still set user from session to avoid blocking the login
            setCurrentUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || '',
              role: currentSession.user.user_metadata?.role || 'user',
            });
          }
        }
        
        if (mounted) setIsLoading(false);
      } catch (error) {
        console.error('Error checking existing session:', error);
        if (mounted) setIsLoading(false);
      }
    };
    
    checkExistingSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log(`Attempting login for: ${email}`);
      
      // Use Supabase auth directly for login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error from Supabase:', error.message);
        // Pass the error to the caller with code for specific handling
        throw {
          message: error.message,
          code: error.code
        };
      }
      
      if (!data.session) {
        console.error('No session returned from login');
        throw new Error('Authentication failed. Please try again.');
      }
      
      console.log('Login successful, session established');
      // Auth state change event will handle setting the user
      return;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Using signUp for client-side signup
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user',
          },
        },
      });

      if (error) {
        throw error;
      }
      
      toast.success('Account created successfully! Please check your email to confirm your registration.');
    } catch (error: any) {
      console.error('Signup failed:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.message.includes('already registered')) {
        errorMessage = 'Email is already in use. Please use a different email or try logging in.';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('You have been logged out');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    isAdmin,
    session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
