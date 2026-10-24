import { useEffect, useMemo, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface RankEntry {
  uid: string;
  name: string;
  points: number;
  completed: number;
  rank: number;
  isMe: boolean;
}

// Ranking en vivo: escucha la colección "users" ordenada por puntos
export default function useRanking(myUid: string | undefined) {
  const [all, setAll] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!myUid) return;
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(100));
    return onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs
          .map((d) => {
            const data = d.data() as any;
            return {
              uid: d.id,
              name: data.name || (data.email ?? 'Jugador').split('@')[0],
              points: Number(data.points) || 0,
              completed: Array.isArray(data.missions) ? data.missions.filter((m: any) => m.completed).length : 0,
              rank: 0,
              isMe: d.id === myUid,
            };
          })
          // Empate: primero quien tenga más misiones, luego por nombre
          .sort((a, b) => b.points - a.points || b.completed - a.completed || a.name.localeCompare(b.name))
          .map((r, i) => ({ ...r, rank: i + 1 }));
        setAll(rows);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, [myUid]);

  // Top 5: si estás en el top se muestra tal cual; si no, top 4 + tú con tu puesto real
  const top = useMemo(() => {
    const me = all.find((r) => r.isMe);
    if (!me || me.rank <= 5) return all.slice(0, 5);
    return [...all.filter((r) => !r.isMe).slice(0, 4), me];
  }, [all]);

  const me = all.find((r) => r.isMe) ?? null;

  return { top, me, total: all.length, loading, error };
}
