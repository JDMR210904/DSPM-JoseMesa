import { useState } from 'react';
import { useHistory } from 'react-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonText,
} from '@ionic/react';
import { setAuth } from '../utils/storage';

// Usuario fijo proporcionado por el desarrollador (requisito del parcial)
const USERS = [{ username: 'medico', password: 'medico123' }];

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const handleLogin = () => {
    const found = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (found) {
      setAuth({ username: found.username });
      history.push('/tabs/visitas');
    } else {
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>MediClinic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText color="medium">
          <p>Ingreso de médicos</p>
        </IonText>

        <IonItem>
          <IonLabel position="stacked">Usuario</IonLabel>
          <IonInput
            value={username}
            onIonInput={(e) => setUsername(e.detail.value ?? '')}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Contraseña</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? '')}
          />
        </IonItem>

        <IonButton expand="block" className="ion-margin-top" onClick={handleLogin}>
          Ingresar
        </IonButton>

        <IonText color="medium">
          <p className="ion-text-center">Usuario de prueba: medico / medico123</p>
        </IonText>

        <IonToast
          isOpen={showToast}
          message="Usuario o contraseña incorrectos"
          duration={2000}
          color="danger"
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
