import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Vibrador del celular (Haptics). En PC no hace nada y no falla.
export default function useVibration() {
  const vibrate = async (ms = 800) => {
    try {
      await Haptics.vibrate({ duration: ms });
    } catch {
      navigator.vibrate?.(ms);
    }
  };
  const tap = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      /* sin vibrador */
    }
  };
  const success = async () => {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      /* sin vibrador */
    }
  };
  return { vibrate, tap, success };
}
