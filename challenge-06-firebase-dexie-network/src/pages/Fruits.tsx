import {
  IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonPage,
  IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useNetworkContext } from '../context/NetworkContext';
import useDexie from '../hooks/useDexie';

// Frutas en Dexie (IndexedDB local). Funciona SIN conexión, por eso no se deshabilita.
const Fruits: React.FC = () => {
  const { connected } = useNetworkContext();
  const { results, error, add, deleteItem } = useDexie();
  const [nombre, setNombre] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [fechaCosecha, setFechaCosecha] = useState('');

  const save = async () => {
    if (!nombre.trim()) return;
    if (await add({ nombre, proveedor, fechaCosecha })) {
      setNombre(''); setProveedor(''); setFechaCosecha('');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary"><IonTitle>Frutas (Dexie)</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <IonNote>{connected ? 'En línea' : 'Sin conexión'} · los datos se guardan en el dispositivo</IonNote>
          <IonInput className="ion-margin-top" label="Nombre de la fruta" labelPlacement="floating" fill="outline"
            value={nombre} onIonInput={(e) => setNombre(e.detail.value ?? '')} />
          <IonInput className="ion-margin-top" label="Proveedor" labelPlacement="floating" fill="outline"
            value={proveedor} onIonInput={(e) => setProveedor(e.detail.value ?? '')} />
          <IonInput className="ion-margin-top" label="Fecha de cosecha" labelPlacement="floating" fill="outline" type="date"
            value={fechaCosecha} onIonInput={(e) => setFechaCosecha(e.detail.value ?? '')} />
          <IonButton expand="block" className="ion-margin-top" onClick={save} disabled={!nombre.trim()}>Agregar fruta</IonButton>
          {error && <IonText color="danger"><p>{error}</p></IonText>}
        </div>
        <IonList>
          {results.map((f) => (
            <IonItem key={f.id}>
              <IonLabel>
                <h2>{f.nombre}</h2>
                <p>{f.proveedor || 'Sin proveedor'} · {f.fechaCosecha || 'Sin fecha'}</p>
              </IonLabel>
              <IonButtons slot="end">
                <IonButton color="danger" onClick={() => deleteItem(f.id!)}>
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

export default Fruits;
