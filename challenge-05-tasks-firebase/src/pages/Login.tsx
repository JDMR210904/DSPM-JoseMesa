import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, error, setError } = useAuthContext();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (await login(email, password)) history.replace('/tasks');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Iniciar sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          label="Correo" labelPlacement="floating" fill="outline" type="email"
          value={email} onIonInput={(e) => setEmail(e.detail.value ?? '')}
        />
        <IonInput
          className="ion-margin-top" label="Contraseña" labelPlacement="floating" fill="outline" type="password"
          value={password} onIonInput={(e) => setPassword(e.detail.value ?? '')}
        />
        {error && <IonText color="danger"><p>{error}</p></IonText>}
        <IonButton expand="block" className="ion-margin-top" onClick={handleLogin} disabled={!email || !password}>
          Ingresar
        </IonButton>
        <IonButton expand="block" fill="clear" onClick={() => { setError(null); history.push('/register'); }}>
          ¿No tienes cuenta? Regístrate
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
