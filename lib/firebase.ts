// DISHA AI — Firebase Client SDK Initialization
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Only initialize Firebase when the API key is present.
// This prevents crashes during Next.js build-time prerendering (SSR/SSG)
// when NEXT_PUBLIC_* env vars are not yet embedded in the bundle.
const app: FirebaseApp | null = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0])
  : null;

export const auth: Auth | null = app ? getAuth(app) : null;

export const googleProvider: GoogleAuthProvider | null = app
  ? (() => {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      return provider;
    })()
  : null;

export default app;
