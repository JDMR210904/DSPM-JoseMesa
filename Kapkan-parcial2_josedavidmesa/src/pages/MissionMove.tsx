import { IonContent, IonIcon, IonPage, useIonRouter } from '@ionic/react';
import { arrowForward, checkmarkCircle, footstepsOutline, locateOutline, navigateOutline, play, stop as stopIcon } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import Aurora from '../components/Aurora';
import ProgressRing from '../components/ProgressRing';
import TopBar from '../components/TopBar';
import { DEMO_MODE } from '../config/firebase';
import { getMission, MAX_GPS_ACCURACY_METERS, MOVE_TARGET_METERS } from '../config/missions';
import { useProgress } from '../context/ProgressContext';
import useGeolocation, { Fix } from '../hooks/useGeolocation';
import { distanceMeters } from '../utils/geo';

const mission = getMission(2);
const fmt = (n: number) => n.toFixed(6);

// Misión 2: detectar un cambio real de ubicación mayor a MOVE_TARGET_METERS
const MissionMove: React.FC = () => {
  const { fix, watching, error, start, stop } = useGeolocation();
  const { isCompleted, completeMission } = useProgress();
  const router = useIonRouter();
  const [origin, setOrigin] = useState<Fix | null>(null);
  const [distance, setDistance] = useState(0);
  const [simulated, setSimulated] = useState(0);
  const done = isCompleted(mission.id);
  const total = distance + simulated;

  // Cada nueva lectura del GPS: fija el origen (la primera buena) o calcula la distancia
  useEffect(() => {
    if (!watching || !fix) return;
    const goodEnough = DEMO_MODE || fix.accuracy <= MAX_GPS_ACCURACY_METERS;
    if (!goodEnough) return;
    if (!origin) {
      setOrigin(fix);
      return;
    }
    setDistance(distanceMeters(origin.lat, origin.lng, fix.lat, fix.lng));
  }, [fix, watching, origin]);

  // ¿Se superó la distancia objetivo?
  useEffect(() => {
    if (watching && origin && !done && total >= MOVE_TARGET_METERS) {
      completeMission(mission.id);
      stop();
    }
  }, [total, watching, origin, done, completeMission, stop]);

  const begin = () => {
    setOrigin(null);
    setDistance(0);
    setSimulated(0);
    start();
  };

  const status = !watching
    ? done ? '¡Misión completada!' : 'Toca "Iniciar" y empieza a caminar'
    : !origin
      ? `Buscando buena señal GPS${fix ? ` (±${Math.round(fix.accuracy)} m)` : '…'}`
      : total < MOVE_TARGET_METERS ? '¡Sigue caminando! 🚶' : '¡Lo lograste!';

  return (
    <IonPage>
      <IonContent fullscreen>
        <Aurora />
        <div className="page">
          <TopBar />
          <div className="mission-hero">
            <div className="badge" style={{ background: mission.gradient, boxShadow: `0 14px 40px ${mission.glow}66` }}>
              <IonIcon icon={footstepsOutline} />
            </div>
            <h1>{mission.title}</h1>
            <p>{mission.description} · <b style={{ color: 'var(--gold)' }}>+{mission.points} pts</b></p>
          </div>

          <div className="radar">
            {watching && <><span className="ring-pulse" /><span className="ring-pulse" /><span className="ring-pulse" /></>}
            <ProgressRing value={done ? 1 : total / MOVE_TARGET_METERS} size={230} stroke={16} colors={['#00e0ff', '#3d5afe']}>
              <div>
                {done && !watching ? (
                  <IonIcon icon={checkmarkCircle} style={{ fontSize: 72, color: 'var(--lime)' }} />
                ) : (
                  <>
                    <div className="num" style={{ fontSize: 52, fontWeight: 700, lineHeight: 1 }}>{total.toFixed(1)}</div>
                    <div className="muted" style={{ fontWeight: 600 }}>de {MOVE_TARGET_METERS} m</div>
                  </>
                )}
              </div>
            </ProgressRing>
          </div>

          <p className="still-state">{status}</p>

          <div className="glass pad" style={{ marginTop: 14 }}>
            <div className="info-line"><span className="k"><IonIcon icon={locateOutline} /> Origen</span><span className="num">{origin ? `${fmt(origin.lat)}, ${fmt(origin.lng)}` : '—'}</span></div>
            <div className="info-line"><span className="k"><IonIcon icon={navigateOutline} /> Actual</span><span className="num">{fix ? `${fmt(fix.lat)}, ${fmt(fix.lng)}` : '—'}</span></div>
            <div className="info-line"><span className="k">Precisión GPS</span><span className="num">{fix ? `±${Math.round(fix.accuracy)} m` : '—'}</span></div>
          </div>

          <div className="stack" style={{ marginTop: 18 }}>
            {error && <div className="error-box">{error}</div>}
            {done && !watching ? (
              <button className="btn btn-primary" onClick={() => router.push('/mission-still', 'forward')}>
                Siguiente: Permanencia activa <IonIcon icon={arrowForward} />
              </button>
            ) : watching ? (
              <button className="btn btn-ghost" onClick={stop}><IonIcon icon={stopIcon} /> Detener</button>
            ) : (
              <button className="btn btn-primary" onClick={begin}><IonIcon icon={play} /> Iniciar</button>
            )}
            {DEMO_MODE && watching && (
              <div className="demo">
                <div className="demo-title">Modo demo</div>
                <button className="btn btn-ghost" onClick={() => { if (!origin && fix) setOrigin(fix); setSimulated((s) => s + 10); }}>
                  Simular +10 m
                </button>
              </div>
            )}
            <p className="note">Consejo: sal a un lugar abierto. Las lecturas con precisión peor a ±{MAX_GPS_ACCURACY_METERS} m se ignoran para evitar falsos positivos.</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MissionMove;
