import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export default function useHaptics() {
  return {
    impact: (style: ImpactStyle = ImpactStyle.Medium) => Haptics.impact({ style }),
    vibrate: (duration = 400) => Haptics.vibrate({ duration }),
    notification: (type: NotificationType = NotificationType.Success) => Haptics.notification({ type }),
    selection: async () => {
      await Haptics.selectionStart();
      await Haptics.selectionChanged();
      await Haptics.selectionEnd();
    },
  };
}

export { ImpactStyle, NotificationType };
