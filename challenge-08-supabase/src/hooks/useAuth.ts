import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    return !error;
  };

  const register = async (email: string, password: string) => {
    setError(null);
    setInfo(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      return false;
    }
    // Si "Confirm email" está activo no hay sesión hasta confirmar el correo
    if (!data.session) setInfo('Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.');
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, error, info, setError, setInfo, login, register, logout };
}
