import { useHistory } from 'react-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import { clearAuth, getAuth } from '../utils/storage';

const Perfil: React.FC = () => {
  const history = useHistory();
  const user = getAuth();

  const handleLogout = () => {
    clearAuth();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem lines="none">
          <IonIcon icon={personCircleOutline} slot="start" size="large" />
          <IonLabel>
            <h2>{user?.username}</h2>
            <p>Médico</p>
          </IonLabel>
        </IonItem>

        <IonButton
          expand="block"
          color="danger"
          className="ion-margin-top"
          onClick={handleLogout}
        >
          Cerrar sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
