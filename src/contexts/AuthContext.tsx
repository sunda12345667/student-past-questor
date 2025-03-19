
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('studyquest_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock authentication functions (to be replaced with real backend)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation. In a real app, this would be an API call
      const isAdmin = email.includes('admin');
      const mockUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role: isAdmin ? 'admin' : 'user',
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save user to localStorage
      localStorage.setItem('studyquest_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation. In a real app, this would be an API call
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user',
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Save user to localStorage
      localStorage.setItem('studyquest_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear user from localStorage
      localStorage.removeItem('studyquest_user');
      setCurrentUser(null);
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
