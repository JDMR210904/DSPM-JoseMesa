import { useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

let nextId = Math.floor(Date.now() % 100000);
const isNative = Capacitor.isNativePlatform();

// Notificaciones locales ("Has completado una misión", etc.)
// - App nativa (Android/iOS): plugin @capacitor/local-notifications
// - Web (PC o Netlify en el celular): Notification API a través del service worker
export default function useLocalNotifications() {
  const ensurePermission = useCallback(async () => {
    try {
      if (isNative) {
        const current = await LocalNotifications.checkPermissions();
        if (current.display === 'granted') return true;
        return (await LocalNotifications.requestPermissions()).display === 'granted';
      }
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'granted') return true;
      if (Notification.permission === 'denied') return false;
      return (await Notification.requestPermission()) === 'granted';
    } catch {
      return false;
    }
  }, []);

  const showWeb = async (title: string, body: string) => {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.showNotification(title, { body, icon: '/icon.svg', badge: '/icon.svg', tag: String(nextId++) });
    else new Notification(title, { body }); // PC sin service worker
  };

  // delaySeconds > 0 la muestra un momento después
  const notify = useCallback(
    async (title: string, body: string, delaySeconds = 0) => {
      try {
        if (!(await ensurePermission())) return;
        if (isNative) {
          await LocalNotifications.schedule({
            notifications: [
              {
                id: nextId++,
                title,
                body,
                ...(delaySeconds > 0 ? { schedule: { at: new Date(Date.now() + delaySeconds * 1000) } } : {}),
              },
            ],
          });
        } else if (delaySeconds > 0) {
          window.setTimeout(() => showWeb(title, body).catch(() => undefined), delaySeconds * 1000);
        } else {
          await showWeb(title, body);
        }
      } catch (e) {
        console.warn('No se pudo mostrar la notificación', e);
      }
    },
    [ensurePermission]
  );

  return { ensurePermission, notify };
}
