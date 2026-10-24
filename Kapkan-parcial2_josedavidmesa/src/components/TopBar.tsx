import { IonIcon, useIonRouter } from '@ionic/react';
import { chevronBackOutline, starOutline } from 'ionicons/icons';
import { useProgress } from '../context/ProgressContext';

// Barra superior de las pantallas de misión: botón atrás + puntos actuales
const TopBar: React.FC = () => {
  const router = useIonRouter();
  const { progress } = useProgress();
  const back = () => (router.canGoBack() ? router.goBack() : router.push('/tabs/missions', 'back'));
  return (
    <div className="topbar">
      <button className="icon-btn" onClick={back} aria-label="Volver">
        <IonIcon icon={chevronBackOutline} />
      </button>
      <span className="chip points"><IonIcon icon={starOutline} /> <span className="num">{progress.points}</span> pts</span>
    </div>
  );
};

export default TopBar;
