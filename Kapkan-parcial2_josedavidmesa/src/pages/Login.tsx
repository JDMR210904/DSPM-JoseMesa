import { IonContent, IonIcon, IonPage, IonSpinner, useIonRouter } from '@ionic/react';
import { arrowForward, lockClosedOutline, mailOutline, rocket } from 'ionicons/icons';
import { FormEvent, useState } from 'react';
import Aurora from '../components/Aurora';
import { useAuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, error, setError } = useAuthContext();
  const router = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await login(email, password);
    setBusy(false);
    if (ok) router.push('/tabs/missions', 'root', 'replace');
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Aurora />
        <div className="page center">
          <div className="logo"><IonIcon icon={rocket} /></div>
          <h1 className="brand"><span className="grad-text">Kapkan</span></h1>
          <p className="tagline">Completa misiones en el mundo real,<br />gana puntos y sube en el ranking.</p>

          <form className="glass pad stack" onSubmit={submit}>
            <label className="field">
              <IonIcon icon={mailOutline} />
              <input type="email" placeholder="Correo" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="field">
              <IonIcon icon={lockClosedOutline} />
              <input type="password" placeholder="Contraseña" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <div className="error-box">{error}</div>}
            <button className="btn btn-primary" type="submit" disabled={busy || !email || !password}>
              {busy ? <IonSpinner name="crescent" /> : <>Iniciar sesión <IonIcon icon={arrowForward} /></>}
            </button>
          </form>

          <button className="link-btn" onClick={() => { setError(null); router.push('/register', 'forward'); }}>
            ¿No tienes cuenta? <b>Regístrate</b>
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
