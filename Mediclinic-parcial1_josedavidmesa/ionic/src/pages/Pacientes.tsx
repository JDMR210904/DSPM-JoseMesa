import { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { getPatients, Patient } from '../utils/storage';

const Pacientes: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    setPatients(getPatients());
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {patients.map((p) => (
            <IonItem key={p.id}>
              <IonLabel>
                <h2>
                  {p.nombre} {p.apellido}
                </h2>
                <p>
                  CC: {p.cc} · Tel: {p.telefono}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Pacientes;
