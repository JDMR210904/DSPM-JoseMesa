import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Register: React.FC = () => {
  const { register, error, info, setError, setInfo } = useAuthContext();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Con "Confirm email" desactivado, onAuthStateChange crea la sesión y la ruta redirige sola
    if (await register(email, password)) history.replace('/tareas');
  };

  return (
    <IonPage>
      <IonHeader><IonToolbar color="primary"><IonTitle>Crear cuenta</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonInput label="Correo" labelPlacement="floating" fill="outline" type="email"
          value={email} onIonInput={(e) => setEmail(e.detail.value ?? '')} />
        <IonInput className="ion-margin-top" label="Contraseña (mín. 6)" labelPlacement="floating" fill="outline" type="password"
          value={password} onIonInput={(e) => setPassword(e.detail.value ?? '')} />
        {error && <IonText color="danger"><p>{error}</p></IonText>}
        {info && <IonText color="success"><p>{info}</p></IonText>}
        <IonButton expand="block" className="ion-margin-top" onClick={handleRegister} disabled={!email || password.length < 6}>
          Crear cuenta
        </IonButton>
        <IonButton expand="block" fill="clear" onClick={() => { setError(null); setInfo(null); history.push('/login'); }}>
          Ya tengo cuenta
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
