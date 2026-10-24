import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
  user_id: string;
  created_at: string;
}

// CRUD + lista en vivo (Realtime) de la tabla "tareas"
export default function useTareas(userId: string | undefined) {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('tareas').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setTareas(data as Tarea[]);
    setLoading(false);
  }, []);

  // Carga inicial + suscripción a cambios en vivo
  useEffect(() => {
    if (!userId) return;
    load();
    const channel = supabase
      .channel(`tareas-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, load]);

  const run = async (op: PromiseLike<{ error: { message: string } | null }>) => {
    setError(null);
    const { error } = await op;
    if (error) setError(error.message);
    return !error;
  };

  // user_id se llena solo en la BD (default auth.uid())
  const add = (titulo: string) => run(supabase.from('tareas').insert({ titulo }));
  const toggle = (t: Tarea) => run(supabase.from('tareas').update({ completada: !t.completada }).eq('id', t.id));
  const rename = (id: number, titulo: string) => run(supabase.from('tareas').update({ titulo }).eq('id', id));
  const remove = (id: number) => run(supabase.from('tareas').delete().eq('id', id));

  return { tareas, loading, error, add, toggle, rename, remove };
}
