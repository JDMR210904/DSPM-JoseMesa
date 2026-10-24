import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import useAccelerometer from '../hooks/useAccelerometer';
import SensorPage from './SensorPage';

const f = (n?: number | null) => (typeof n === 'number' && Number.isFinite(n) ? n.toFixed(2) : '—');

const AccelerometerPage: React.FC = () => {
  const { accel, orientation, active, error, start, stop } = useAccelerometer();
  return (
    <SensorPage title="Acelerómetro" error={error}>
      <IonButton expand="block" color={active ? 'danger' : 'primary'} onClick={active ? stop : start}>
        {active ? 'Detener' : 'Iniciar lectura'}
      </IonButton>
      {active && !accel && !orientation && (
        <p className="ion-text-center">Esperando datos… si estás en un PC sin sensor de movimiento no llegará nada; prueba en un celular.</p>
      )}
      <IonCard>
        <IonCardHeader><IonCardTitle>Aceleración (m/s²)</IonCardTitle></IonCardHeader>
        <IonCardContent>X: {f(accel?.x)} · Y: {f(accel?.y)} · Z: {f(accel?.z)}</IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader><IonCardTitle>Orientación (°)</IonCardTitle></IonCardHeader>
        <IonCardContent>α: {f(orientation?.alpha)} · β: {f(orientation?.beta)} · γ: {f(orientation?.gamma)}</IonCardContent>
      </IonCard>
    </SensorPage>
  );
};

export default AccelerometerPage;
