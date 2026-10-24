import {
  IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage,
  IonSpinner, IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useNetworkContext } from '../context/NetworkContext';
import useCollection from '../hooks/useCollection';
import OfflineBanner from './OfflineBanner';

// Contactos en Cloud Firestore
const Contacts: React.FC = () => {
  const { connected } = useNetworkContext();
  const { results, isPending, error, getAll, add, update, remove } = useCollection('contactos');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => { if (connected) getAll(); }, [connected]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => { setEditingId(null); setNombre(''); setTelefono(''); };

  const save = async () => {
    if (!nombre.trim()) return;
    if (editingId) await update(editingId, { nombre, telefono });
    else await add({ nombre, telefono });
    reset();
    await getAll();
  };

  const del = async (id: string) => { await remove(id); await getAll(); };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary"><IonTitle>Contactos (Firestore)</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent>
        <OfflineBanner />
        <div className="ion-padding">
          <IonInput label="Nombre" labelPlacement="floating" fill="outline" value={nombre} disabled={!connected}
            onIonInput={(e) => setNombre(e.detail.value ?? '')} />
          <IonInput className="ion-margin-top" label="Teléfono" labelPlacement="floating" fill="outline" type="tel"
            value={telefono} disabled={!connected} onIonInput={(e) => setTelefono(e.detail.value ?? '')} />
          <IonButton expand="block" className="ion-margin-top" onClick={save} disabled={!connected || isPending || !nombre.trim()}>
            {isPending ? <IonSpinner name="crescent" /> : editingId ? 'Actualizar contacto' : 'Agregar contacto'}
          </IonButton>
          {editingId && <IonButton expand="block" fill="clear" onClick={reset}>Cancelar edición</IonButton>}
          {error && <IonText color="danger"><p>{error}</p></IonText>}
        </div>
        <IonList>
          {results.map((c) => (
            <IonItem key={c.id}>
              <IonLabel>
                <h2>{c.nombre}</h2>
                <p>{c.telefono}</p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton disabled={!connected} onClick={() => { setEditingId(c.id); setNombre(c.nombre); setTelefono(c.telefono ?? ''); }}>
                  Editar
                </IonButton>
                <IonButton color="danger" disabled={!connected} onClick={() => del(c.id)}>
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

export default Contacts;
