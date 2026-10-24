import { IonContent, IonIcon, IonPage, IonSpinner, useIonRouter } from '@ionic/react';
import { arrowForward, lockClosedOutline, mailOutline, personOutline, sparkles } from 'ionicons/icons';
import { FormEvent, useState } from 'react';
import Aurora from '../components/Aurora';
import { useAuthContext } from '../context/AuthContext';

const Register: React.FC = () => {
  const { register, error, setError } = useAuthContext();
  const router = useIonRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (mismatch) return;
    setBusy(true);
    const ok = await register(name, email, password);
    setBusy(false);
    if (ok) router.push('/tabs/missions', 'root', 'replace');
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Aurora />
        <div className="page center">
          <div className="logo"><IonIcon icon={sparkles} /></div>
          <h1 className="brand" style={{ fontSize: 36 }}>Crea tu <span className="grad-text">cuenta</span></h1>
          <p className="tagline">Tu nombre aparecerá en el ranking.</p>

          <form className="glass pad stack" onSubmit={submit}>
            <label className="field">
              <IonIcon icon={personOutline} />
              <input placeholder="Nombre de jugador" maxLength={20} value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="field">
              <IonIcon icon={mailOutline} />
              <input type="email" placeholder="Correo" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="field">
              <IonIcon icon={lockClosedOutline} />
              <input type="password" placeholder="Contraseña (mín. 6)" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label className="field">
              <IonIcon icon={lockClosedOutline} />
              <input type="password" placeholder="Confirmar contraseña" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </label>
            {mismatch && <div className="error-box">Las contraseñas no coinciden.</div>}
            {error && <div className="error-box">{error}</div>}
            <button className="btn btn-primary" type="submit" disabled={busy || !name.trim() || !email || password.length < 6 || mismatch}>
              {busy ? <IonSpinner name="crescent" /> : <>Crear cuenta <IonIcon icon={arrowForward} /></>}
            </button>
          </form>

          <button className="link-btn" onClick={() => { setError(null); router.push('/login', 'back'); }}>
            ¿Ya tienes cuenta? <b>Inicia sesión</b>
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
