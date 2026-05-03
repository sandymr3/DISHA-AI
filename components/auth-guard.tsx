'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useStudent } from '@/lib/student-context';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const { studentId, isReady: studentReady } = useStudent();
  const router = useRouter();

  useEffect(() => {
    // Wait until both auth and student context are initialized
    if (!loading && studentReady && !user && !studentId) {
      router.replace('/auth');
    }
  }, [user, loading, studentId, studentReady, router]);

  if (loading || !studentReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
          <p className="text-white/30 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !studentId) return null;

  return <>{children}</>;
}
