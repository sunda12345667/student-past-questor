
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile data
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching profile:', error);
          }

          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: profile?.role || session.user.user_metadata?.role || 'user'
          };
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (session?.user && mounted) {
          // Fetch user profile data
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: profile?.role || session.user.user_metadata?.role || 'user'
          };
          setCurrentUser(userData);
          setSession(session);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful:', data.user?.email);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful:', data.user?.email);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear admin authentication when logging out
      localStorage.removeItem('adminAuthenticated');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      setCurrentUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const isAdmin = () => {
    const isAdminUser = currentUser?.role === 'admin' || currentUser?.email === 'irapidbusiness@gmail.com';
    const hasAdminAuth = localStorage.getItem('adminAuthenticated') === 'true';
    return isAdminUser || hasAdminAuth;
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
