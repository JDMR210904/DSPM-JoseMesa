import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { ReactNode } from 'react';

// Contenedor común de todas las páginas de sensores (encabezado con botón atrás)
const SensorPage: React.FC<{ title: string; error?: string | null; children: ReactNode }> = ({ title, error, children }) => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      {children}
      {error && <IonText color="danger"><p>{error}</p></IonText>}
    </IonContent>
  </IonPage>
);

export default SensorPage;
