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
      if (auth && typeof auth.signInWithEmailAndPassword === 'function') {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login successful! Welcome back.');
      } else {
        console.warn("Firebase auth not initialized. Cannot log in.");
        toast.error('Authentication service unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials and try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Create user in Firebase Auth and our backend
      if (auth && typeof auth.createUserWithEmailAndPassword === 'function') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Call our backend to create the user in Firestore with additional data
        await api.post('/auth/signup', {
          name,
          email,
          password,
          uid: userCredential.user.uid
        });
        
        toast.success('Account created successfully! Welcome to StudyQuest.');
      } else {
        console.warn("Firebase auth not initialized. Cannot sign up.");
        toast.error('Authentication service unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Signup failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (auth && typeof auth.signOut === 'function') {
        await firebaseSignOut(auth);
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
