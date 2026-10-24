import { useState } from 'react';
import { LocalNotifications, PendingLocalNotificationSchema } from '@capacitor/local-notifications';

export default function useLocalNotifications() {
  const [pending, setPending] = useState<PendingLocalNotificationSchema[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshPending = async () => setPending((await LocalNotifications.getPending()).notifications);

  // Programa una notificación local dentro de "seconds" segundos
  const schedule = async (title: string, body: string, seconds: number) => {
    setError(null);
    try {
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') throw new Error('Permiso de notificaciones denegado');
      await LocalNotifications.schedule({
        notifications: [{
          id: Math.floor(Math.random() * 100000),
          title,
          body,
          schedule: { at: new Date(Date.now() + seconds * 1000) },
        }],
      });
      await refreshPending();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const cancelAll = async () => {
    const { notifications } = await LocalNotifications.getPending();
    if (notifications.length) await LocalNotifications.cancel({ notifications });
    await refreshPending();
  };

  return { pending, error, schedule, cancelAll, refreshPending };
}
