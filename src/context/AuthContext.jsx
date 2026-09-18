import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

const AuthContext = createContext(null);

function clearUserScopedAppState(uid) {
  const keepKeys = ['sekale-theme'];
  Object.keys(localStorage).forEach((key) => {
    if (keepKeys.includes(key)) return;
    if (key.startsWith('sekale-')) {
      if (!uid) {
        localStorage.removeItem(key);
        return;
      }

      const suffix = `-${uid}`;
      if (key.endsWith(suffix) || key === 'sekale-chat-history' || key === 'sekale-style' || key === 'sekale-dynamic' || key === 'sekale-auto-detect' || key === 'sekale-retain-logs' || key === 'sekale-anon-opt' || key === 'sekale-engine-state' || key === 'sekale-profile-text') {
        localStorage.removeItem(key);
      }
    }
  });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        setProfile(
          snap.exists()
            ? snap.data()
            : {
                name: u.displayName || 'User',
                email: u.email || '',
                plan: 'Free',
              },
        );
      } catch {
        setProfile({
          name: u.displayName || 'User',
          email: u.email || '',
          plan: 'Free',
        });
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  /** Persist a profile document for the signed-in user. */
  async function ensureProfile(uid, profileData) {
    const ref = doc(db, 'users', uid);
    await setDoc(
      ref,
      { createdAt: new Date().toISOString(), ...profileData },
      { merge: true },
    );
    const snap = await getDoc(ref);
    setProfile(snap.exists() ? snap.data() : profileData);
    return ref;
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      /** Create account with email/password + display name, then persist profile. */
      async signup({ name, email, password }) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(cred.user, { displayName: name });
          onAuthStateChanged(auth, setUser);
        }
        await ensureProfile(cred.user.uid, { name, email, plan: 'Free', createdAt: new Date().toISOString() });
        return cred.user;
      },
      /** Sign in with email/password. */
      async login(email, password) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return cred.user;
      },
      /** Sign in with Google. */
      async loginGoogle() {
        const cred = await signInWithPopup(auth, googleProvider);
        await ensureProfile(cred.user.uid, {
          name: cred.user.displayName || '',
          email: cred.user.email || '',
          plan: 'Free',
          createdAt: new Date().toISOString(),
        });
        return cred.user;
      },
      async logout() {
        clearUserScopedAppState(user?.uid);
        await signOut(auth);
        setUser(null);
        setProfile(null);
      },
    }),
    [user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    return {
      user: null,
      profile: null,
      loading: true,
      signup: async () => null,
      login: async () => null,
      loginGoogle: async () => null,
      logout: async () => undefined,
    };
  }

  return context;
}
