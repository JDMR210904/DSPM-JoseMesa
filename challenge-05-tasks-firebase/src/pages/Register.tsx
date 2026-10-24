import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Register: React.FC = () => {
  const { register, error, setError } = useAuthContext();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState('');

  const handleRegister = async () => {
    if (password !== confirm) return setLocalError('Las contraseñas no coinciden');
    setLocalError('');
    if (await register(email, password)) history.replace('/tasks'); // Firebase deja la sesión iniciada
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Crear cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          label="Correo" labelPlacement="floating" fill="outline" type="email"
          value={email} onIonInput={(e) => setEmail(e.detail.value ?? '')}
        />
        <IonInput
          className="ion-margin-top" label="Contraseña (mín. 6)" labelPlacement="floating" fill="outline" type="password"
          value={password} onIonInput={(e) => setPassword(e.detail.value ?? '')}
        />
        <IonInput
          className="ion-margin-top" label="Confirmar contraseña" labelPlacement="floating" fill="outline" type="password"
          value={confirm} onIonInput={(e) => setConfirm(e.detail.value ?? '')}
        />
        {(localError || error) && <IonText color="danger"><p>{localError || error}</p></IonText>}
        <IonButton expand="block" className="ion-margin-top" onClick={handleRegister} disabled={!email || !password}>
          Crear cuenta
        </IonButton>
        <IonButton expand="block" fill="clear" onClick={() => { setError(null); history.push('/login'); }}>
          Ya tengo cuenta
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
