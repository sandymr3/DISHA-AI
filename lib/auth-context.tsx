'use client';

import {
  createContext, useContext, useEffect, useState, useCallback, type ReactNode
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  idToken: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Firebase not initialized (env vars absent during build) — skip auth listener
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (!auth || !auth.currentUser) return null;
    const token = await auth.currentUser.getIdToken(/* forceRefresh */ true);
    setIdToken(token);
    return token;
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase is not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase is not initialized');
    await createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!auth || !googleProvider) throw new Error('Firebase is not initialized');
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) throw new Error('Firebase is not initialized');
    await firebaseSignOut(auth);
    setIdToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, idToken,
      signInWithEmail, signUpWithEmail, signInWithGoogle,
      signOut, refreshToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
