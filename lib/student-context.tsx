'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { StudentProfile, ECPResult } from './types';
import { getStudent } from './api';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface StudentState {
  studentId: string | null;
  profile: StudentProfile | null;
  ecpResult: ECPResult | null;
}

interface StudentContextValue extends StudentState {
  setStudent: (studentId: string, profile: StudentProfile, ecpResult: ECPResult) => void;
  clearStudent: () => void;
  isReady: boolean;
}

const StudentContext = createContext<StudentContextValue | undefined>(undefined);

const STORAGE_KEY = 'disha_student';

export function StudentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudentState>({
    studentId: null,
    profile: null,
    ecpResult: null,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // First try loading from localStorage (fast path)
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as StudentState;
        if (parsed.studentId && parsed.profile && parsed.ecpResult) {
          setState(parsed);
        }
      }
    } catch {
      // Ignore corrupted data
    }

    // Then sync with backend when Firebase auth resolves
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsReady(false);
        // Use Firebase UID as canonical studentId
        try {
          const record = await getStudent(user.uid);
          const newState: StudentState = {
            studentId: record.studentId,
            profile: record.profile,
            ecpResult: record.ecpResult,
          };
          setState(newState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        } catch {
          // Profile not yet created — that's fine, user will go through calculator
          setState({ studentId: null, profile: null, ecpResult: null });
        }
      } else {
        // Signed out — clear student state
        setState({ studentId: null, profile: null, ecpResult: null });
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      }
      setIsReady(true);
    });

    return unsubscribe;
  }, []);

  const setStudent = useCallback(
    (studentId: string, profile: StudentProfile, ecpResult: ECPResult) => {
      const newState: StudentState = { studentId, profile, ecpResult };
      setState(newState);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch {
        // Storage full — continue without persistence
      }
    },
    []
  );

  const clearStudent = useCallback(() => {
    setState({ studentId: null, profile: null, ecpResult: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return (
    <StudentContext.Provider value={{ ...state, setStudent, clearStudent, isReady }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent(): StudentContextValue {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
