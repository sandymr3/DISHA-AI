'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { useStudent } from '@/lib/student-context';
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, UserCircle } from 'lucide-react';
import { getStudent } from '@/lib/api';

type Mode = 'signin' | 'signup' | 'demo';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const { studentId, setStudent, isReady: studentReady } = useStudent();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [demoId, setDemoId] = useState('STU-PRIYA001');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user && studentReady) {
      router.replace(studentId ? '/dashboard' : '/calculator');
    }
  }, [user, loading, studentId, studentReady, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
      </div>
    );
  }

  const formatError = (code: string): string => {
    const map: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account already exists with this email.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/popup-closed-by-user': 'Sign-in cancelled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (mode === 'demo') {
        const record = await getStudent(demoId);
        setStudent(record.studentId, record.profile, record.ecpResult);
        router.push('/dashboard');
        return;
      }
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      // onAuthStateChanged in context will handle redirect via useEffect above
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      setError(formatError(code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || '';
      setError(formatError(code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.012] blur-[160px]" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-white/[0.008] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.04] px-6 py-4">
        <button
          onClick={() => router.push('/')}
          className="text-xl font-bold text-white hover:text-white/80 transition-colors"
        >
          DISHA AI
        </button>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/50">
              <Sparkles className="w-3 h-3" />
              Fund-First Education Finance
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Demo Access'}
            </h1>
            <p className="text-white/40 text-sm">
              {mode === 'signin'
                ? 'Sign in to access your ECP dashboard'
                : mode === 'demo'
                ? 'Explore the dashboard using a pre-loaded backend profile'
                : 'Start your education finance journey'}
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 space-y-4 relative overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Mode Tabs */}
            <div className="flex rounded-xl bg-white/[0.04] p-1 gap-1">
              {(['signin', 'signup', 'demo'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    mode === m
                      ? 'bg-white text-black shadow'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : m === 'signup' ? 'Sign Up' : 'Demo'}
                </button>
              ))}
            </div>

            {mode !== 'demo' ? (
              <>
                {/* Google Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogle}
                  disabled={isSubmitting}
                  className="w-full border-white/[0.12] hover:border-white/25 hover:bg-white/[0.04] text-white gap-3 h-11"
                >
                  {/* Google SVG */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-xs text-white/30">or</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
              </>
            ) : null}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'demo' ? (
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <select
                    value={demoId}
                    onChange={(e) => setDemoId(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-black border border-white/[0.1] rounded-md text-white focus:border-white/40 h-11 appearance-none"
                    required
                  >
                    <option value="STU-PRIYA001">Priya Sharma (MS USA)</option>
                    <option value="STU-ROHAN002">Rohan Mehta (MBA USA)</option>
                    <option value="STU-ANJALI003">Anjali Nair (MiM Canada)</option>
                  </select>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      id="auth-email"
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-black border-white/[0.1] text-white placeholder:text-white/30 focus:border-white/40 h-11"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      id="auth-password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9 bg-black border-white/[0.1] text-white placeholder:text-white/30 focus:border-white/40 h-11"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </>
              )}

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400/90 text-xs px-1"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isSubmitting || (mode !== 'demo' && (!email || !password))}
                className="w-full bg-white text-black hover:bg-white/90 font-semibold h-11 gap-2 group"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Please wait...</>
                ) : mode === 'signin' ? (
                  <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                ) : mode === 'signup' ? (
                  <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                ) : (
                  <>Enter Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs text-white/20 mt-6 px-4"
          >
            By continuing, you agree to DISHA AI&apos;s terms. Your data is secured with Firebase.
          </motion.p>
        </div>
      </main>
    </div>
  );
}
