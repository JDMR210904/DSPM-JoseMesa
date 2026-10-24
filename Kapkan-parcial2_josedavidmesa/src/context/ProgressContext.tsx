import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getMission, MISSIONS } from '../config/missions';
import useLocalNotifications from '../hooks/useLocalNotifications';
import useVibration from '../hooks/useVibration';
import { local } from '../utils/storage';
import { useAuthContext } from './AuthContext';

// ── Formato que se guarda en Firebase y en localStorage ──
// { "points": 120, "missions": [ { "id": 1, "completed": true }, ... ] }
export interface MissionState {
  id: number;
  completed: boolean;
}
export interface Progress {
  points: number;
  missions: MissionState[];
}
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

const emptyProgress = (): Progress => ({
  points: 0,
  missions: MISSIONS.map((m) => ({ id: m.id, completed: false })),
});

const pointsOf = (missions: MissionState[]) =>
  missions.filter((m) => m.completed).reduce((sum, m) => sum + getMission(m.id).points, 0);

// Asegura que estén las 3 misiones y que los puntos cuadren
const normalize = (raw?: Partial<Progress> | null): Progress => {
  const missions = MISSIONS.map((m) => ({
    id: m.id,
    completed: !!raw?.missions?.find((x) => x.id === m.id)?.completed,
  }));
  return { points: pointsOf(missions), missions };
};

// Une el progreso local y el de Firebase: una misión completada en cualquiera cuenta
const merge = (a: Progress, b: Progress): Progress =>
  normalize({
    missions: a.missions.map((m) => ({
      id: m.id,
      completed: m.completed || !!b.missions.find((x) => x.id === m.id)?.completed,
    })),
  });

const progressKey = (uid: string) => `kapkan_progress_${uid}`;
const evidenceKey = (uid: string) => `kapkan_evidence_${uid}`;

interface ProgressContextType {
  progress: Progress;
  ready: boolean;
  syncStatus: SyncStatus;
  evidence: string | null;
  lastCompleted: { id: number; at: number } | null;
  completedCount: number;
  percent: number;
  isCompleted: (id: number) => boolean;
  isUnlocked: (id: number) => boolean;
  completeMission: (id: number) => Promise<boolean>;
  saveEvidence: (thumbDataUrl: string) => void;
  resetProgress: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const { notify } = useLocalNotifications();
  const { success } = useVibration();

  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [evidence, setEvidence] = useState<string | null>(null);
  const [lastCompleted, setLastCompleted] = useState<{ id: number; at: number } | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  // ── Enviar puntos a Firebase ──
  const saveRemote = useCallback(
    async (p: Progress) => {
      if (!user) return;
      if (!navigator.onLine) {
        setSyncStatus('offline');
        return;
      }
      setSyncStatus('syncing');
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          { name: user.name, email: user.email, points: p.points, missions: p.missions, updatedAt: serverTimestamp() },
          { merge: true }
        );
        setSyncStatus('synced');
      } catch (e) {
        console.warn('Error guardando en Firebase', e);
        setSyncStatus('error');
      }
    },
    [user]
  );

  const persist = useCallback(
    (p: Progress) => {
      if (!user) return;
      local.set(progressKey(user.uid), p); // guardado local inmediato
      saveRemote(p); // y en Firebase
    },
    [user, saveRemote]
  );

  // ── Cargar progreso al iniciar sesión: primero local (rápido), luego Firebase ──
  useEffect(() => {
    if (!user) {
      setProgress(emptyProgress());
      setEvidence(null);
      setReady(false);
      setSyncStatus('idle');
      return;
    }
    let cancelled = false;
    const localProgress = normalize(local.get<Progress>(progressKey(user.uid)));
    setProgress(localProgress);
    setEvidence(local.get<string>(evidenceKey(user.uid)));
    setReady(true);

    (async () => {
      setSyncStatus('syncing');
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (cancelled) return;
        const remote = normalize(snap.exists() ? (snap.data() as Progress) : null);
        const merged = merge(localProgress, remote);
        setProgress(merged);
        local.set(progressKey(user.uid), merged);
        // Si había cambios locales que Firebase no tenía, o el documento no existía, se suben
        if (!snap.exists() || merged.points !== remote.points || snap.data()?.name !== user.name) {
          await saveRemote(merged);
        } else {
          setSyncStatus('synced');
        }
      } catch (e) {
        console.warn('No se pudo leer Firebase, se usa el progreso local', e);
        if (!cancelled) setSyncStatus(navigator.onLine ? 'error' : 'offline');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, saveRemote]);

  // Al recuperar internet se reintenta subir el progreso
  useEffect(() => {
    const onOnline = () => saveRemote(progressRef.current);
    const onOffline = () => setSyncStatus('offline');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [saveRemote]);

  const isCompleted = useCallback(
    (id: number) => !!progress.missions.find((m) => m.id === id)?.completed,
    [progress]
  );

  const isUnlocked = useCallback(
    (id: number) => {
      const req = getMission(id).requires;
      return req ? isCompleted(req) : true;
    },
    [isCompleted]
  );

  const completeMission = useCallback(
    async (id: number) => {
      const current = progressRef.current;
      if (current.missions.find((m) => m.id === id)?.completed) return false;

      const next = normalize({
        missions: current.missions.map((m) => (m.id === id ? { ...m, completed: true } : m)),
      });
      progressRef.current = next;
      setProgress(next);
      persist(next);
      setLastCompleted({ id, at: Date.now() });
      success();

      // ── Notificaciones locales ──
      const mission = getMission(id);
      const remaining = next.missions.filter((m) => !m.completed).length;
      await notify('🎯 ¡Misión completada!', `Has completado una misión: ${mission.title} (+${mission.points} pts)`);
      if (remaining === 1) await notify('⏳ ¡Ya casi!', 'Te falta 1 misión para completar', 3);
      if (remaining === 0) await notify('🏆 ¡Lo lograste!', `Completaste todas las misiones: ${next.points} puntos`, 3);
      return true;
    },
    [persist, notify, success]
  );

  const saveEvidence = useCallback(
    (thumb: string) => {
      if (!user) return;
      setEvidence(thumb);
      local.set(evidenceKey(user.uid), thumb);
    },
    [user]
  );

  const resetProgress = useCallback(async () => {
    if (!user) return;
    const empty = emptyProgress();
    progressRef.current = empty;
    setProgress(empty);
    setEvidence(null);
    local.remove(evidenceKey(user.uid));
    persist(empty);
  }, [user, persist]);

  const syncNow = useCallback(() => saveRemote(progressRef.current), [saveRemote]);

  const completedCount = progress.missions.filter((m) => m.completed).length;
  const percent = Math.round((completedCount / MISSIONS.length) * 100);

  return (
    <ProgressContext.Provider
      value={{
        progress, ready, syncStatus, evidence, lastCompleted, completedCount, percent,
        isCompleted, isUnlocked, completeMission, saveEvidence, resetProgress, syncNow,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress debe usarse dentro de <ProgressProvider>');
  return ctx;
}
