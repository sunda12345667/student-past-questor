
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Convert Supabase user to our User type
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            role: session.user.user_metadata?.role || 'user'
          };
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: session.user.user_metadata?.role || 'user'
        };
        setCurrentUser(userData);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }

    if (data.user) {
      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
        role: data.user.user_metadata?.role || 'user'
      };
      setCurrentUser(userData);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
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

    if (data.user) {
      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: name,
        role: 'user'
      };
      setCurrentUser(userData);
      
      // For testing purposes, immediately sign in the user after signup
      if (data.session) {
        setSession(data.session);
      }
    }
  };

  const logout = async () => {
    // Clear admin authentication when logging out
    localStorage.removeItem('adminAuthenticated');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setCurrentUser(null);
    setSession(null);
  };

  const isAdmin = () => {
    // Check both user role and localStorage for admin authentication
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
