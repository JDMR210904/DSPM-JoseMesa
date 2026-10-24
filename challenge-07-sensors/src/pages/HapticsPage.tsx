import { IonButton } from '@ionic/react';
import useHaptics, { ImpactStyle, NotificationType } from '../hooks/useHaptics';
import SensorPage from './SensorPage';

const HapticsPage: React.FC = () => {
  const h = useHaptics();
  return (
    <SensorPage title="Vibración (Haptics)">
      <IonButton expand="block" onClick={() => h.impact(ImpactStyle.Light)}>Impacto suave</IonButton>
      <IonButton expand="block" onClick={() => h.impact(ImpactStyle.Medium)}>Impacto medio</IonButton>
      <IonButton expand="block" onClick={() => h.impact(ImpactStyle.Heavy)}>Impacto fuerte</IonButton>
      <IonButton expand="block" color="success" onClick={() => h.notification(NotificationType.Success)}>Notificación: éxito</IonButton>
      <IonButton expand="block" color="warning" onClick={() => h.notification(NotificationType.Warning)}>Notificación: advertencia</IonButton>
      <IonButton expand="block" color="danger" onClick={() => h.notification(NotificationType.Error)}>Notificación: error</IonButton>
      <IonButton expand="block" color="secondary" onClick={h.selection}>Selección</IonButton>
      <IonButton expand="block" color="dark" onClick={() => h.vibrate(600)}>Vibrar 600 ms</IonButton>
    </SensorPage>
  );
};

export default HapticsPage;
