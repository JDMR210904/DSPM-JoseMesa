import { IonContent, IonIcon, IonPage, useIonAlert, useIonRouter } from '@ionic/react';
import { checkmarkCircle, ellipseOutline, logOutOutline, refreshOutline, syncOutline, trophy } from 'ionicons/icons';
import Aurora from '../components/Aurora';
import ProgressRing from '../components/ProgressRing';
import SyncChip from '../components/SyncChip';
import { MISSIONS, TOTAL_POINTS } from '../config/missions';
import { useAuthContext } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import useCountUp from '../hooks/useCountUp';
import useRanking from '../hooks/useRanking';

// Pantalla de resultados: puntos totales, misiones completadas y estado general
const Results: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { progress, completedCount, percent, isCompleted, evidence, syncStatus, syncNow, resetProgress } = useProgress();
  const { me } = useRanking(user?.uid);
  const [presentAlert] = useIonAlert();
  const router = useIonRouter();
  const points = useCountUp(progress.points);

  const status =
    completedCount === MISSIONS.length
      ? { text: '¡Completado!', color: 'var(--lime)', emoji: '🏆' }
      : completedCount === 0
        ? { text: 'Sin empezar', color: 'var(--muted)', emoji: '🚀' }
        : { text: 'En progreso', color: 'var(--cyan)', emoji: '🔥' };

  const confirmReset = () =>
    presentAlert({
      header: '¿Reiniciar progreso?',
      message: 'Tus puntos volverán a 0 en el dispositivo y en Firebase.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Reiniciar', role: 'destructive', handler: () => { resetProgress(); } },
      ],
    });

  const handleLogout = async () => {
    await logout();
    router.push('/login', 'root', 'replace');
  };

  // Lo que se guarda en Firebase y en localStorage
  const saved = JSON.stringify(progress, null, 2);

  return (
    <IonPage>
      <IonContent fullscreen>
        <Aurora />
        <div className="page">
          <div className="row between">
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>Resultados</h1>
            <SyncChip status={syncStatus} />
          </div>

          <div className="glass pad glow-border" style={{ marginTop: 18, textAlign: 'center' }}>
            <div style={{ display: 'grid', placeItems: 'center' }}>
              <ProgressRing value={percent / 100} size={190} stroke={15} colors={['#ffd23d', '#ff3d81']}>
                <div>
                  <IonIcon icon={trophy} style={{ fontSize: 30, color: 'var(--gold)' }} />
                  <div className="num" style={{ fontSize: 50, fontWeight: 700, lineHeight: 1 }}>{points}</div>
                  <div className="muted" style={{ fontWeight: 600 }}>de {TOTAL_POINTS} pts</div>
                </div>
              </ProgressRing>
            </div>
            <div style={{ marginTop: 14, fontSize: 22, fontWeight: 800, color: status.color }}>
              {status.emoji} {status.text}
            </div>
          </div>

          <div className="stats" style={{ marginTop: 14 }}>
            <div className="glass stat">
              <div className="label">Misiones</div>
              <div className="value num">{completedCount}<span className="dim">/{MISSIONS.length}</span></div>
            </div>
            <div className="glass stat">
              <div className="label">Progreso</div>
              <div className="value num">{percent}%</div>
            </div>
            <div className="glass stat">
              <div className="label">Puntos</div>
              <div className="value num" style={{ color: 'var(--gold)' }}>{progress.points}</div>
            </div>
            <div className="glass stat">
              <div className="label">Ranking</div>
              <div className="value num">{me ? `#${me.rank}` : '—'}</div>
            </div>
          </div>

          <div className="section-title">Detalle de misiones</div>
          <div className="glass pad">
            {MISSIONS.map((m) => {
              const ok = isCompleted(m.id);
              return (
                <div className="info-line" key={m.id}>
                  <span className="k" style={{ color: ok ? 'var(--text)' : undefined }}>
                    <IonIcon icon={ok ? checkmarkCircle : ellipseOutline} style={{ color: ok ? 'var(--lime)' : 'var(--dim)' }} />
                    {m.title}
                  </span>
                  <b className="num" style={{ color: ok ? 'var(--gold)' : 'var(--dim)' }}>{ok ? `+${m.points}` : '0'} pts</b>
                </div>
              );
            })}
          </div>

          {evidence && (
            <>
              <div className="section-title">Tu evidencia</div>
              <div className="glass" style={{ overflow: 'hidden' }}>
                <img src={evidence} alt="Evidencia" style={{ width: '100%', display: 'block', maxHeight: 280, objectFit: 'cover' }} />
              </div>
            </>
          )}

          <div className="section-title">Datos guardados (Firebase + local)</div>
          <pre className="glass pad num" style={{ margin: 0, fontSize: 12.5, color: 'var(--cyan)', overflowX: 'auto' }}>{saved}</pre>

          <div className="stack" style={{ marginTop: 20 }}>
            <button className="btn btn-ghost" onClick={syncNow}><IonIcon icon={syncOutline} /> Enviar puntos a Firebase</button>
            <button className="btn btn-danger" onClick={confirmReset}><IonIcon icon={refreshOutline} /> Reiniciar progreso</button>
            <button className="btn btn-ghost" onClick={handleLogout}><IonIcon icon={logOutOutline} /> Cerrar sesión</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Results;
