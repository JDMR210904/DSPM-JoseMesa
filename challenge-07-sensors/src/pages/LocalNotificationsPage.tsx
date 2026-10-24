import { IonButton, IonInput, IonItem, IonLabel, IonList } from '@ionic/react';
import { useEffect, useState } from 'react';
import useLocalNotifications from '../hooks/useLocalNotifications';
import SensorPage from './SensorPage';

const LocalNotificationsPage: React.FC = () => {
  const { pending, error, schedule, cancelAll, refreshPending } = useLocalNotifications();
  const [title, setTitle] = useState('Recordatorio');
  const [body, setBody] = useState('¡Hola desde una notificación local!');
  const [seconds, setSeconds] = useState('5');

  useEffect(() => { refreshPending().catch(() => undefined); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SensorPage title="Notificaciones locales" error={error}>
      <IonInput label="Título" labelPlacement="floating" fill="outline" value={title} onIonInput={(e) => setTitle(e.detail.value ?? '')} />
      <IonInput className="ion-margin-top" label="Mensaje" labelPlacement="floating" fill="outline" value={body}
        onIonInput={(e) => setBody(e.detail.value ?? '')} />
      <IonInput className="ion-margin-top" label="Segundos de espera" labelPlacement="floating" fill="outline" type="number"
        value={seconds} onIonInput={(e) => setSeconds(e.detail.value ?? '')} />
      <IonButton expand="block" className="ion-margin-top" onClick={() => schedule(title, body, Math.max(1, Number(seconds) || 5))}>
        Programar notificación
      </IonButton>
      <IonButton expand="block" color="danger" fill="outline" onClick={cancelAll}>Cancelar pendientes</IonButton>
      <IonList>
        {pending.map((n) => (
          <IonItem key={n.id}><IonLabel><h3>{n.title}</h3><p>{n.body}</p></IonLabel></IonItem>
        ))}
      </IonList>
    </SensorPage>
  );
};

export default LocalNotificationsPage;
