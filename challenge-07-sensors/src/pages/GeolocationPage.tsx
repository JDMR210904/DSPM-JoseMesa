import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel } from '@ionic/react';
import useGeolocation from '../hooks/useGeolocation';
import SensorPage from './SensorPage';

const GeolocationPage: React.FC = () => {
  const { position, watching, error, getCurrentPosition, startWatching, stopWatching } = useGeolocation();
  const c = position?.coords;
  return (
    <SensorPage title="Geolocalización" error={error}>
      <IonButton expand="block" onClick={getCurrentPosition}>Obtener posición actual</IonButton>
      <IonButton expand="block" color={watching ? 'danger' : 'secondary'} onClick={watching ? stopWatching : startWatching}>
        {watching ? 'Detener seguimiento' : 'Seguir posición'}
      </IonButton>
      {c && (
        <IonCard>
          <IonCardHeader><IonCardTitle>Posición</IonCardTitle></IonCardHeader>
          <IonCardContent>
            <IonItem><IonLabel>Latitud: {c.latitude.toFixed(6)}</IonLabel></IonItem>
            <IonItem><IonLabel>Longitud: {c.longitude.toFixed(6)}</IonLabel></IonItem>
            <IonItem><IonLabel>Precisión: {c.accuracy?.toFixed(1)} m</IonLabel></IonItem>
            <IonItem><IonLabel>Altitud: {c.altitude ?? 'n/d'}</IonLabel></IonItem>
            <IonItem><IonLabel>Velocidad: {c.speed ?? 'n/d'}</IonLabel></IonItem>
            <IonButton fill="clear" href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`} target="_blank">
              Ver en Google Maps
            </IonButton>
          </IonCardContent>
        </IonCard>
      )}
    </SensorPage>
  );
};

export default GeolocationPage;
