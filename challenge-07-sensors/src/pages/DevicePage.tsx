import { IonButton, IonItem, IonLabel, IonList, IonProgressBar } from '@ionic/react';
import useDevice from '../hooks/useDevice';
import SensorPage from './SensorPage';

const DevicePage: React.FC = () => {
  const { info, battery, deviceId, error, refresh } = useDevice();
  const level = battery?.batteryLevel;
  return (
    <SensorPage title="Dispositivo" error={error}>
      <IonButton expand="block" onClick={refresh}>Actualizar</IonButton>
      {info && (
        <IonList>
          <IonItem><IonLabel>Modelo: {info.model}</IonLabel></IonItem>
          <IonItem><IonLabel>Fabricante: {info.manufacturer}</IonLabel></IonItem>
          <IonItem><IonLabel>Plataforma: {info.platform}</IonLabel></IonItem>
          <IonItem><IonLabel>Sistema: {info.operatingSystem} {info.osVersion}</IonLabel></IonItem>
          <IonItem><IonLabel>Virtual: {info.isVirtual ? 'Sí' : 'No'}</IonLabel></IonItem>
          <IonItem><IonLabel className="ion-text-wrap">ID: {deviceId?.identifier}</IonLabel></IonItem>
        </IonList>
      )}
      {level !== undefined && (
        <div className="ion-padding-top">
          <IonLabel>Batería: {Math.round(level * 100)}% {battery?.isCharging ? '(cargando)' : ''}</IonLabel>
          <IonProgressBar value={level} />
        </div>
      )}
    </SensorPage>
  );
};

export default DevicePage;
