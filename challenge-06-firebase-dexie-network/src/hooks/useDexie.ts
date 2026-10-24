import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/dexie';
import type { Fruta } from '../db/dexie';

// CRUD sobre la tabla de Dexie (IndexedDB) con escucha en tiempo real (useLiveQuery)
export default function useDexie(filterFn?: (f: Fruta) => boolean) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se vuelve a ejecutar sola cada vez que cambia la tabla
  const results = useLiveQuery(
    () => (filterFn ? db.frutas.filter(filterFn).toArray() : db.frutas.toArray()),
    [filterFn]
  ) ?? [];

  const run = async (fn: () => Promise<unknown>) => {
    setIsPending(true);
    setError(null);
    try {
      await fn();
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  const add = (data: Omit<Fruta, 'id' | 'createdAt'>) =>
    run(() => db.frutas.add({ ...data, createdAt: new Date().toISOString() }));

  const update = (id: number, data: Partial<Fruta>) => run(() => db.frutas.update(id, data));

  const deleteItem = (id: number) => run(() => db.frutas.delete(id));

  return { results, isPending, error, add, update, deleteItem };
}
