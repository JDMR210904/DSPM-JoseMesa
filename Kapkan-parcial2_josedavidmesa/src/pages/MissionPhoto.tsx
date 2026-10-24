import { IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import { cameraOutline, checkmarkCircle, cloudDoneOutline, refreshOutline, saveOutline } from 'ionicons/icons';
import { useState } from 'react';
import { Directory, Filesystem } from '@capacitor/filesystem';
import Aurora from '../components/Aurora';
import TopBar from '../components/TopBar';
import { getMission } from '../config/missions';
import { useProgress } from '../context/ProgressContext';
import useCamera from '../hooks/useCamera';
import { resizeDataUrl } from '../utils/image';

const mission = getMission(1);

// Misión 1: tomar una foto y guardarla. Se completa al GUARDAR la imagen.
const MissionPhoto: React.FC = () => {
  const { photo, setPhoto, error, takePhoto } = useCamera();
  const { isCompleted, completeMission, saveEvidence, evidence } = useProgress();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const done = isCompleted(mission.id);
  const shown = photo ?? evidence;

  const save = async () => {
    if (!photo) return;
    setSaving(true);
    setSaveError(null);
    try {
      // 1) Guarda la foto completa en el almacenamiento del dispositivo
      await Filesystem.writeFile({
        path: `kapkan/evidencia_${Date.now()}.jpg`,
        data: photo.split(',')[1],
        directory: Directory.Data,
        recursive: true,
      });
      // 2) Guarda una miniatura para mostrarla en la app
      saveEvidence(await resizeDataUrl(photo, 480));
      // 3) Completa la misión
      await completeMission(mission.id);
      setPhoto(null);
    } catch (e: any) {
      setSaveError(e?.message ?? 'No se pudo guardar la imagen');
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Aurora />
        <div className="page">
          <TopBar />
          <div className="mission-hero">
            <div className="badge" style={{ background: mission.gradient, boxShadow: `0 14px 40px ${mission.glow}66` }}>
              <IonIcon icon={cameraOutline} />
            </div>
            <h1>{mission.title}</h1>
            <p>{mission.description} · <b style={{ color: 'var(--gold)' }}>+{mission.points} pts</b></p>
          </div>

          <div className="viewfinder">
            {shown ? (
              <img src={shown} alt="Evidencia" />
            ) : (
              <div className="placeholder">
                <IonIcon icon={cameraOutline} />
                <p>Apunta a algo interesante<br />y toma tu evidencia</p>
              </div>
            )}
            {!shown && <div className="scanline" />}
            <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
          </div>

          <div className="stack" style={{ marginTop: 18 }}>
            {(error || saveError) && <div className="error-box">{error || saveError}</div>}

            {photo ? (
              <>
                <button className="btn btn-success" onClick={save} disabled={saving}>
                  {saving ? <IonSpinner name="crescent" /> : <><IonIcon icon={saveOutline} /> Guardar evidencia</>}
                </button>
                <button className="btn btn-ghost" onClick={takePhoto} disabled={saving}>
                  <IonIcon icon={refreshOutline} /> Repetir foto
                </button>
              </>
            ) : done ? (
              <>
                <div className="glass pad row" style={{ justifyContent: 'center' }}>
                  <IonIcon icon={checkmarkCircle} style={{ color: 'var(--lime)', fontSize: 26 }} />
                  <b>Evidencia guardada · misión completada</b>
                </div>
                <button className="btn btn-ghost" onClick={takePhoto}>
                  <IonIcon icon={cameraOutline} /> Tomar otra foto
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={takePhoto}>
                <IonIcon icon={cameraOutline} /> Tomar foto
              </button>
            )}
            {photo && done && <p className="note"><IonIcon icon={cloudDoneOutline} /> Ya completaste esta misión: guardar otra foto no suma puntos.</p>}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MissionPhoto;
