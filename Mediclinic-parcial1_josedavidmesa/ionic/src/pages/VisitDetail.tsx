import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonBadge,
} from '@ionic/react';
import { getVisits, saveVisits, Visit, EstadoVisita } from '../utils/storage';

// pendiente -> en_camino -> finalizada
const NEXT_STATE: Record<EstadoVisita, EstadoVisita | null> = {
  pendiente: 'en_camino',
  en_camino: 'finalizada',
  finalizada: null,
};

const NEXT_LABEL: Record<EstadoVisita, string> = {
  pendiente: 'Marcar en camino',
  en_camino: 'Marcar finalizada',
  finalizada: '',
};

const ESTADO_COLOR: Record<EstadoVisita, string> = {
  pendiente: 'medium',
  en_camino: 'warning',
  finalizada: 'success',
};

const ESTADO_TEXTO: Record<EstadoVisita, string> = {
  pendiente: 'Pendiente',
  en_camino: 'En camino',
  finalizada: 'Finalizada',
};

const VisitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [visit, setVisit] = useState<Visit | null>(null);

  useEffect(() => {
    const visits = getVisits();
    const found = visits.find((v) => v.id === Number(id));
    setVisit(found ?? null);
  }, [id]);

  const advanceState = () => {
    if (!visit) return;
    const next = NEXT_STATE[visit.estado];
    if (!next) return;

    const visits = getVisits();
    const updated = visits.map((v) =>
      v.id === visit.id ? { ...v, estado: next } : v
    );
    saveVisits(updated);
    setVisit({ ...visit, estado: next });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/visitas" />
          </IonButtons>
          <IonTitle>Detalle de visita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!visit ? (
          <p>Visita no encontrada.</p>
        ) : (
          <>
            <IonItem lines="none">
              <IonLabel>
                <h1>{visit.paciente}</h1>
                <p>Hora: {visit.hora}</p>
              </IonLabel>
              <IonBadge color={ESTADO_COLOR[visit.estado]}>
                {ESTADO_TEXTO[visit.estado]}
              </IonBadge>
            </IonItem>

            {NEXT_STATE[visit.estado] && (
              <IonButton
                expand="block"
                className="ion-margin-top"
                onClick={advanceState}
              >
                {NEXT_LABEL[visit.estado]}
              </IonButton>
            )}

            {!NEXT_STATE[visit.estado] && (
              <p className="ion-text-center">
                Esta visita ya fue finalizada.
              </p>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default VisitDetail;
