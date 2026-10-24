import { useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';

export interface AuthUser {
  uid: string;
  email: string | null;
}

const toAuthUser = (u: User | null): AuthUser | null =>
  u ? { uid: u.uid, email: u.email } : null;

// Custom hook: encapsula la lógica de Firebase (login, registro, logout)
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // true mientras Firebase restaura la sesión
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(toAuthUser(u));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  };

  const register = async (email: string, password: string) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, loading, error, setError, login, register, logout };
}
