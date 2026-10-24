import { IonIcon, IonItem, IonLabel } from '@ionic/react';
import { cloudOfflineOutline } from 'ionicons/icons';
import { useNetworkContext } from '../context/NetworkContext';

// Aviso visible cuando no hay red (Contactos y Tareas se deshabilitan)
const OfflineBanner: React.FC = () => {
  const { connected } = useNetworkContext();
  if (connected) return null;
  return (
    <IonItem color="warning" lines="none">
      <IonIcon slot="start" icon={cloudOfflineOutline} />
      <IonLabel className="ion-text-wrap">Sin conexión: las acciones de esta sección están deshabilitadas.</IonLabel>
    </IonItem>
  );
};

export default OfflineBanner;
