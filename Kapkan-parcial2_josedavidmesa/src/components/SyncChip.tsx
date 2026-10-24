import { IonIcon } from '@ionic/react';
import { cloudDoneOutline, cloudOfflineOutline, cloudUploadOutline, warningOutline } from 'ionicons/icons';
import { SyncStatus } from '../context/ProgressContext';

const MAP: Record<SyncStatus, { icon: string; text: string; color: string }> = {
  idle: { icon: cloudUploadOutline, text: 'Local', color: 'var(--muted)' },
  syncing: { icon: cloudUploadOutline, text: 'Sincronizando', color: 'var(--cyan)' },
  synced: { icon: cloudDoneOutline, text: 'En la nube', color: 'var(--lime)' },
  offline: { icon: cloudOfflineOutline, text: 'Sin conexión', color: 'var(--gold)' },
  error: { icon: warningOutline, text: 'Error de sync', color: '#ff8098' },
};

// Indica si el progreso está guardado en Firebase
const SyncChip: React.FC<{ status: SyncStatus }> = ({ status }) => {
  const s = MAP[status];
  return (
    <span className="chip" style={{ color: s.color }}>
      <IonIcon icon={s.icon} /> {s.text}
    </span>
  );
};

export default SyncChip;
