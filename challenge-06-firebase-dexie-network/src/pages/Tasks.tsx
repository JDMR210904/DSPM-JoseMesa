import {
  IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList,
  IonPage, IonSpinner, IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useNetworkContext } from '../context/NetworkContext';
import useRealTimeCollection from '../hooks/useRealTimeCollection';
import OfflineBanner from './OfflineBanner';

// Tareas en Firebase Realtime Database (la lista se actualiza sola con onValue)
const Tasks: React.FC = () => {
  const { connected } = useNetworkContext();
  const { results, isPending, error, add, update, deleteDoc } = useRealTimeCollection('tareas');
  const [titulo, setTitulo] = useState('');

  const save = async () => {
    if (!titulo.trim()) return;
    await add({ titulo, completada: false });
    setTitulo('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary"><IonTitle>Tareas (Realtime DB)</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent>
        <OfflineBanner />
        <div className="ion-padding">
          <IonInput label="Nueva tarea" labelPlacement="floating" fill="outline" value={titulo} disabled={!connected}
            onIonInput={(e) => setTitulo(e.detail.value ?? '')} />
          <IonButton expand="block" className="ion-margin-top" onClick={save} disabled={!connected || !titulo.trim()}>
            Agregar tarea
          </IonButton>
          {isPending && <IonSpinner name="crescent" />}
          {error && <IonText color="danger"><p>{error}</p></IonText>}
        </div>
        <IonList>
          {results.map((t) => (
            <IonItem key={t.id}>
              <IonCheckbox slot="start" checked={!!t.completada} disabled={!connected}
                onIonChange={() => update(t.id, { titulo: t.titulo, completada: !t.completada, createdAt: t.createdAt })} />
              <IonLabel style={{ textDecoration: t.completada ? 'line-through' : 'none' }}>{t.titulo}</IonLabel>
              <IonButtons slot="end">
                <IonButton color="danger" disabled={!connected} onClick={() => deleteDoc(t.id)}>
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tasks;
