import { useEffect, useState } from 'react';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';

export default function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handles: { remove: () => Promise<void> }[] = [];
    let cancelled = false;
    (async () => {
      try {
        const add = async (h: Promise<{ remove: () => Promise<void> }>) => {
          const handle = await h;
          if (cancelled) handle.remove(); else handles.push(handle);
        };
        await add(PushNotifications.addListener('registration', (t) => setToken(t.value)));
        await add(PushNotifications.addListener('registrationError', (e) => setError(JSON.stringify(e))));
        await add(PushNotifications.addListener('pushNotificationReceived', (n) => setNotifications((p) => [n, ...p])));
        await add(PushNotifications.addListener('pushNotificationActionPerformed', (a) => setNotifications((p) => [a.notification, ...p])));
      } catch (e: any) {
        setError(e.message);
      }
    })();
    return () => { cancelled = true; handles.forEach((h) => h.remove()); };
  }, []);

  const register = async () => {
    setError(null);
    try {
      const perm = await PushNotifications.requestPermissions();
      if (perm.receive !== 'granted') throw new Error('Permiso de notificaciones denegado');
      await PushNotifications.register();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return { token, notifications, error, register };
}
