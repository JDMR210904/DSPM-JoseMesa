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
  IonBadge,
} from '@ionic/react';
import { getVisits, Visit } from '../utils/storage';

const ESTADO_COLOR: Record<Visit['estado'], string> = {
  pendiente: 'medium',
  en_camino: 'warning',
  finalizada: 'success',
};

const ESTADO_TEXTO: Record<Visit['estado'], string> = {
  pendiente: 'Pendiente',
  en_camino: 'En camino',
  finalizada: 'Finalizada',
};

const Visitas: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);

  // Se vuelve a leer cada vez que la vista entra en foco, para reflejar
  // los cambios de estado hechos en el detalle.
  useEffect(() => {
    setVisits(getVisits());
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas de hoy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {visits.map((v) => (
            <IonItem key={v.id} routerLink={`/tabs/visitas/${v.id}`} detail>
              <IonLabel>
                <h2>{v.paciente}</h2>
                <p>{v.hora}</p>
              </IonLabel>
              <IonBadge color={ESTADO_COLOR[v.estado]}>
                {ESTADO_TEXTO[v.estado]}
              </IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Visitas;
