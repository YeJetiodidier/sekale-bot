import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration (from firebasecfg.md)
const firebaseConfig = {
  apiKey: 'AIzaSyClq1QxiYkPjGvzupbcKZ7OLSiB5RpDIUs',
  authDomain: 'sekale-bot.firebaseapp.com',
  projectId: 'sekale-bot',
  storageBucket: 'sekale-bot.firebasestorage.app',
  messagingSenderId: '305651116997',
  appId: '1:305651116997:web:307414d1d89b87a258b9ac',
  measurementId: 'G-N2SG16RGFP',
};

const app = initializeApp(firebaseConfig);

// App Check debug-provider setup is intentionally disabled here because the current
// Firebase SDK version in the project does not export DebugProvider.
// Re-enable App Check with a supported provider when Firebase console setup is complete.

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
