import { IonContent, IonIcon, IonPage, useIonRouter } from '@ionic/react';
import { checkmarkCircle, hourglassOutline, lockClosed, phonePortraitOutline, play, trophyOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import Aurora from '../components/Aurora';
import ProgressRing from '../components/ProgressRing';
import TopBar from '../components/TopBar';
import { DEMO_MODE } from '../config/firebase';
import { getMission, STILL_SECONDS } from '../config/missions';
import { useProgress } from '../context/ProgressContext';
import { requestMotionPermission } from '../hooks/useAccelerometer';
import useStillTimer from '../hooks/useStillTimer';
import useVibration from '../hooks/useVibration';

const mission = getMission(3);

// Misión 3: quedarse quieto STILL_SECONDS segundos; al terminar el celular vibra
const MissionStill: React.FC = () => {
  const { isCompleted, isUnlocked, completeMission } = useProgress();
  const { vibrate } = useVibration();
  const router = useIonRouter();
  const [active, setActive] = useState(false);
  const { remaining, done: timerDone, resets, sensorSeen, error, simulateMove } = useStillTimer(active);
  const done = isCompleted(mission.id);
  const unlocked = isUnlocked(mission.id);

  // Pasados los 10 s: vibrar y completar la misión
  useEffect(() => {
    if (active && timerDone) {
      vibrate(1000);
      completeMission(mission.id);
      setActive(false);
    }
  }, [active, timerDone, vibrate, completeMission]);

  const begin = async () => {
    await requestMotionPermission(); // en iPhone muestra el permiso de movimiento
    setActive(true);
  };

  const elapsed = STILL_SECONDS - remaining;
  const noSensor = active && !sensorSeen && elapsed > 2;

  return (
    <IonPage>
      <IonContent fullscreen>
        <Aurora />
        <div className="page">
          <TopBar />
          <div className="mission-hero">
            <div className="badge" style={{ background: mission.gradient, boxShadow: `0 14px 40px ${mission.glow}66` }}>
              <IonIcon icon={unlocked ? hourglassOutline : lockClosed} />
            </div>
            <h1>{mission.title}</h1>
            <p>{mission.description} · <b style={{ color: 'var(--gold)' }}>+{mission.points} pts</b></p>
          </div>

          {!unlocked ? (
            <div className="glass pad stack" style={{ textAlign: 'center' }}>
              <IonIcon icon={lockClosed} style={{ fontSize: 48, color: 'var(--dim)', margin: '0 auto' }} />
              <b style={{ fontSize: 18 }}>Misión bloqueada</b>
              <p className="muted" style={{ margin: 0 }}>Primero recorre los metros de "Movimiento real". Al completarla se habilita esta misión.</p>
              <button className="btn btn-primary" onClick={() => router.push('/mission-move', 'forward')}>Ir a Movimiento real</button>
            </div>
          ) : (
            <>
              <div className="radar" key={resets} >
                <div className={resets > 0 && active ? 'shake' : ''}>
                  <ProgressRing value={done && !active ? 1 : elapsed / STILL_SECONDS} size={230} stroke={16} colors={['#b14dff', '#ff3d81']}>
                    {done && !active ? (
                      <IonIcon icon={checkmarkCircle} style={{ fontSize: 72, color: 'var(--lime)' }} />
                    ) : (
                      <div>
                        <div className="num" style={{ fontSize: 64, fontWeight: 700, lineHeight: 1 }}>{Math.ceil(remaining)}</div>
                        <div className="muted" style={{ fontWeight: 600 }}>segundos</div>
                      </div>
                    )}
                  </ProgressRing>
                </div>
              </div>

              <p className="still-state" style={{ color: active && resets > 0 && elapsed < 1 ? '#ff8098' : undefined }}>
                {done && !active
                  ? '¡Completada! Tu celular vibró 📳'
                  : !active
                    ? 'Pon el celular sobre la mesa o sostenlo sin moverte'
                    : resets > 0 && elapsed < 1
                      ? '¡Te moviste! El conteo se reinició'
                      : 'Quieto… no te muevas 🧘'}
              </p>

              <div className="stack" style={{ marginTop: 18 }}>
                {active && (noSensor || error) && (
                  <p className="note">
                    <IonIcon icon={phonePortraitOutline} /> No se pudo leer el acelerómetro{error ? ` (${error})` : ''}.
                    {' '}¿Estás en un PC? Solo se cuenta el tiempo.
                  </p>
                )}
                {active ? (
                  <button className="btn btn-ghost" onClick={() => setActive(false)}>Cancelar</button>
                ) : done ? (
                  <>
                    <button className="btn btn-primary" onClick={() => router.push('/tabs/results', 'root')}>
                      <IonIcon icon={trophyOutline} /> Ver mis resultados
                    </button>
                    <button className="btn btn-ghost" onClick={begin}>Repetir (no suma puntos)</button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={begin}><IonIcon icon={play} /> Iniciar conteo</button>
                )}
                {DEMO_MODE && active && (
                  <div className="demo">
                    <div className="demo-title">Modo demo</div>
                    <button className="btn btn-ghost" onClick={simulateMove}>Simular que me muevo</button>
                  </div>
                )}
                <p className="note">El conteo corre sin bloquear la pantalla: puedes seguir viendo la app mientras esperas.</p>
              </div>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MissionStill;
