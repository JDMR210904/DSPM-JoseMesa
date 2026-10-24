import { useEffect, useState } from 'react';
import { onValue, push, ref, remove, set } from 'firebase/database';
import { realtimeDb } from '../firebase/config';
import type { Row } from './useCollection';

// CRUD genérico sobre un nodo de Realtime Database con escucha en vivo (onValue)
export default function useRealTimeCollection(table: string) {
  const [results, setResults] = useState<Row[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // onValue mantiene "results" actualizado: por eso no hace falta getAll
  useEffect(() => {
    setIsPending(true);
    const unsubscribe = onValue(
      ref(realtimeDb, table),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.entries(snapshot.val() as Record<string, any>).map(([id, value]) => ({ id, ...value }));
          setResults(data);
        } else {
          setResults([]);
        }
        setIsPending(false);
      },
      (err) => {
        setError(err.message);
        setIsPending(false);
      }
    );
    return () => unsubscribe();
  }, [table]);

  const add = async (data: Record<string, any>) => {
    setError(null);
    try {
      return await push(ref(realtimeDb, table), { ...data, createdAt: new Date().toISOString() });
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  };

  // set reemplaza el registro completo, por eso se envía el objeto completo
  const update = async (id: string, data: Record<string, any>) => {
    setError(null);
    try {
      await set(ref(realtimeDb, `${table}/${id}`), { ...data, updatedAt: new Date().toISOString() });
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  };

  const deleteDoc = async (id: string) => {
    setError(null);
    try {
      await remove(ref(realtimeDb, `${table}/${id}`));
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  };

  return { results, isPending, error, add, update, deleteDoc };
}
