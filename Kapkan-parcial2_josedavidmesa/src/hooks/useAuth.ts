import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { MISSIONS } from '../config/missions';

export interface AppUser {
  uid: string;
  email: string;
  name: string;
}

// Traduce los códigos de error de Firebase a mensajes claros
const friendly = (code: string, fallback: string) => {
  const map: Record<string, string> = {
    'auth/invalid-email': 'El correo no es válido.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/operation-not-allowed': 'Activa Correo/contraseña en Firebase → Authentication.',
    'auth/network-request-failed': 'Sin conexión a internet.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
  };
  if (code.includes('api-key-not-valid')) return 'API key inválida: revisa tu archivo .env y reinicia "npm run dev".';
  return map[code] ?? fallback;
};

export default function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u ? { uid: u.uid, email: u.email ?? '', name: u.displayName || (u.email ?? '').split('@')[0] } : null);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return true;
    } catch (e: any) {
      setError(friendly(e.code ?? '', e.message));
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name.trim() });
      // Documento inicial del usuario (aparece en el ranking con 0 puntos)
      await setDoc(doc(db, 'users', cred.user.uid), {
        name: name.trim(),
        email: cred.user.email,
        points: 0,
        missions: MISSIONS.map((m) => ({ id: m.id, completed: false })),
        updatedAt: serverTimestamp(),
      });
      setUser({ uid: cred.user.uid, email: cred.user.email ?? '', name: name.trim() });
      return true;
    } catch (e: any) {
      setError(friendly(e.code ?? '', e.message));
      return false;
    }
  };

  const logout = () => signOut(auth);

  return { user, loading, error, setError, login, register, logout };
}
