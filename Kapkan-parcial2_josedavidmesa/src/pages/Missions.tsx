import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';
import Aurora from '../components/Aurora';
import MissionCard from '../components/MissionCard';
import ProgressRing from '../components/ProgressRing';
import SyncChip from '../components/SyncChip';
import { MISSIONS, TOTAL_POINTS } from '../config/missions';
import { useAuthContext } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import useCountUp from '../hooks/useCountUp';
import useLocalNotifications from '../hooks/useLocalNotifications';

// Pantalla principal: puntos, progreso y lista de misiones
const Missions: React.FC = () => {
  const { user } = useAuthContext();
  const { progress, completedCount, percent, isCompleted, isUnlocked, syncStatus } = useProgress();
  const { ensurePermission } = useLocalNotifications();
  const router = useIonRouter();
  const points = useCountUp(progress.points);

  // Pide permiso de notificaciones al entrar
  useEffect(() => {
    ensurePermission();
  }, [ensurePermission]);

  const greeting = completedCount === MISSIONS.length ? '¡Eres una leyenda! 🏆' : completedCount === 0 ? '¿Listo para tu primera misión?' : '¡Vas muy bien, sigue así! 🔥';

  return (
    <IonPage>
      <IonContent fullscreen>
        <Aurora />
        <div className="page">
          <div className="row between">
            <div className="row">
              <div className="avatar">{(user?.name ?? '?').slice(0, 1).toUpperCase()}</div>
              <div>
                <div className="hello">Hola 👋</div>
                <div className="hello-name">{user?.name}</div>
              </div>
            </div>
            <SyncChip status={syncStatus} />
          </div>

          <div className="glass score-card glow-border" style={{ marginTop: 22 }}>
            <div className="row between">
              <div>
                <div className="muted" style={{ fontWeight: 600, fontSize: 14 }}>Puntos acumulados</div>
                <div style={{ marginTop: 8 }}>
                  <span className="big num grad-text">{points}</span>
                  <span className="of num">/ {TOTAL_POINTS}</span>
                </div>
              </div>
              <ProgressRing value={percent / 100} size={104} stroke={11}>
                <div>
                  <div className="num" style={{ fontSize: 24, fontWeight: 700 }}>{percent}%</div>
                  <div className="dim" style={{ fontSize: 11, fontWeight: 600 }}>completado</div>
                </div>
              </ProgressRing>
            </div>
            <div style={{ marginTop: 18 }}>
              <div className="row between" style={{ fontSize: 14, marginBottom: 8 }}>
                <span className="muted">{greeting}</span>
                <b className="num">{completedCount}/{MISSIONS.length}</b>
              </div>
              <div className="bar"><span style={{ width: `${percent}%` }} /></div>
            </div>
          </div>

          <div className="section-title">Misiones disponibles</div>
          <div className="stack">
            {MISSIONS.map((m, i) => (
              <MissionCard
                key={m.id}
                index={i}
                mission={m}
                completed={isCompleted(m.id)}
                locked={!isUnlocked(m.id)}
                onClick={() => router.push(m.route, 'forward')}
              />
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Missions;
