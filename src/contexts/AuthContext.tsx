
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import api from '@/services/api';
import { toast } from 'sonner';

// Firebase configuration with provided credentials
const firebaseConfig = {
  apiKey: "AIzaSyDVXNzlAFZO6gFllb2qv48vfNoEG4tFATY",
  authDomain: "student-babb5.firebaseapp.com",
  projectId: "student-babb5",
  storageBucket: "student-babb5.firebasestorage.app",
  messagingSenderId: "992139414648",
  appId: "1:992139414648:web:31465cdcb39ac55210f18d",
  measurementId: "G-3WEM53ZL06"
};

// Initialize Firebase with error handling
let app;
let auth;
let db;

try {
  // Fix initialization by ensuring Firebase modules are properly loaded
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Create fallback objects to prevent app crashes
  auth = {} as any;
  db = {} as any;
}

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      if (auth && typeof auth.onAuthStateChanged === 'function') {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setIsLoading(true);
          if (firebaseUser) {
            try {
              // Get additional user data from Firestore
              if (db && typeof doc === 'function') {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  setCurrentUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || userData.name || '',
                    email: firebaseUser.email || '',
                    role: userData.role || 'user',
                  });
                  
                  // Store auth token
                  const token = await firebaseUser.getIdToken();
                  localStorage.setItem('auth_token', token);
                } else {
                  console.error('User document not found in Firestore');
                  setCurrentUser(null);
                }
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
            localStorage.removeItem('auth_token');
          }
          setIsLoading(false);
        });
      } else {
        console.warn("Firebase auth not properly initialized. Running in demo mode.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in auth state change listener:", error);
      setIsLoading(false);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (typeof auth.signInWithEmailAndPassword === 'function') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('auth_token', token);
        toast.success('Login successful! Welcome back.');
      } else {
        console.warn("Firebase auth not initialized. Cannot log in.");
        toast.error('Authentication service unavailable. Please try again later.');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.code === 'auth/invalid-credential' 
        ? 'Invalid email or password' 
        : 'Login failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      if (typeof auth.createUserWithEmailAndPassword === 'function') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Call our backend to create the user in Firestore with additional data
        await api.post('/auth/signup', {
          name,
          email,
          password,
          uid: userCredential.user.uid
        });
        
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('auth_token', token);
        
        toast.success('Account created successfully! Welcome to StudyQuest.');
      } else {
        console.warn("Firebase auth not initialized. Cannot sign up.");
        toast.error('Authentication service unavailable. Please try again later.');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
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
      if (typeof auth.signOut === 'function') {
        await firebaseSignOut(auth);
        localStorage.removeItem('auth_token');
        toast.success('You have been logged out');
      } else {
        console.warn("Firebase auth not initialized. Cannot log out.");
        localStorage.removeItem('auth_token');
        setCurrentUser(null);
        toast.success('You have been logged out');
      }
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
