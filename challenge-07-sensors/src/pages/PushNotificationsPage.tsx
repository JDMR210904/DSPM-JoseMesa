import { IonButton, IonItem, IonLabel, IonList, IonNote } from '@ionic/react';
import usePushNotifications from '../hooks/usePushNotifications';
import SensorPage from './SensorPage';

const PushNotificationsPage: React.FC = () => {
  const { token, notifications, error, register } = usePushNotifications();
  return (
    <SensorPage title="Notificaciones push" error={error}>
      <IonNote>Requiere un dispositivo/emulador con Firebase configurado (google-services.json). No funciona en el navegador.</IonNote>
      <IonButton expand="block" className="ion-margin-top" onClick={register}>Registrar dispositivo</IonButton>
      {token && (
        <IonItem>
          <IonLabel className="ion-text-wrap"><h3>Token FCM</h3><p style={{ wordBreak: 'break-all' }}>{token}</p></IonLabel>
        </IonItem>
      )}
      <IonList>
        {notifications.map((n, i) => (
          <IonItem key={i}><IonLabel><h3>{n.title}</h3><p>{n.body}</p></IonLabel></IonItem>
        ))}
      </IonList>
    </SensorPage>
  );
};

export default PushNotificationsPage;
