import { useState } from 'react';
import {
  addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where,
  WhereFilterOp,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';

export type Row = { id: string } & Record<string, any>;
export type Filter = [string, WhereFilterOp, unknown];

// CRUD genérico sobre una colección de Firestore
export default function useCollection(table: string) {
  const [results, setResults] = useState<Row[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    setIsPending(true);
    setError(null);
    try {
      return await fn();
    } catch (e: any) {
      setError(e.message);
      return fallback;
    } finally {
      setIsPending(false);
    }
  };

  const getAll = (filters: Filter[] = []) =>
    run(async () => {
      let q = query(collection(firestore, table));
      for (const [field, op, value] of filters) q = query(q, where(field, op, value));
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Row[];
      setResults(docs);
      return docs;
    }, [] as Row[]);

  const add = (data: Record<string, any>) =>
    run(async () => addDoc(collection(firestore, table), { ...data, createdAt: serverTimestamp() }), null);

  const update = (id: string, data: Record<string, any>) =>
    run(async () => {
      await updateDoc(doc(firestore, table, id), { ...data, updatedAt: serverTimestamp() });
      return true;
    }, false);

  const remove = (id: string) =>
    run(async () => {
      await deleteDoc(doc(firestore, table, id));
      return true;
    }, false);

  return { results, isPending, error, getAll, add, update, remove };
}
