'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { StudentProfile, ECPResult } from './types';

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

  // Load from localStorage on mount
  useEffect(() => {
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
    setIsReady(true);
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
