import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {
  cameraOutline, documentOutline, locationOutline, notificationsOutline, phonePortraitOutline, pulseOutline,
  speedometerOutline, cloudUploadOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const sensors = [
  { path: '/geolocation', label: 'Geolocalización (GPS)', icon: locationOutline },
  { path: '/camera', label: 'Cámara', icon: cameraOutline },
  { path: '/accelerometer', label: 'Acelerómetro / Orientación', icon: speedometerOutline },
  { path: '/device', label: 'Dispositivo y batería', icon: phonePortraitOutline },
  { path: '/haptics', label: 'Vibración (Haptics)', icon: pulseOutline },
  { path: '/filesystem', label: 'Archivos (Filesystem)', icon: documentOutline },
  { path: '/local-notifications', label: 'Notificaciones locales', icon: notificationsOutline },
  { path: '/push-notifications', label: 'Notificaciones push', icon: cloudUploadOutline },
];

// Un botón por cada sensor
const Home: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary"><IonTitle>Sensores</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {sensors.map((s) => (
            <IonItem key={s.path} button detail onClick={() => history.push(s.path)}>
              <IonIcon slot="start" icon={s.icon} />
              <IonLabel>{s.label}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
