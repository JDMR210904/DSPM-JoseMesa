import { IonIcon } from '@ionic/react';
import { checkmarkCircle, chevronForward, lockClosed, starOutline } from 'ionicons/icons';
import { getMission, MissionDef } from '../config/missions';

interface Props {
  mission: MissionDef;
  completed: boolean;
  locked: boolean;
  index: number;
  onClick: () => void;
}

const MissionCard: React.FC<Props> = ({ mission, completed, locked, index, onClick }) => (
  <div
    className={`glass mission ${completed ? 'completed' : ''} ${locked ? 'locked' : ''}`}
    style={{ animationDelay: `${index * 90}ms` }}
    onClick={onClick}
    role="button"
  >
    <div className="icon" style={{ background: mission.gradient }}>
      <IonIcon icon={locked ? lockClosed : mission.icon} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="title">{mission.title}</div>
      <div className="desc">
        {locked ? `Completa "${getMission(mission.requires!).title}" para desbloquear` : mission.description}
      </div>
      <div className="chips">
        <span className="chip points"><IonIcon icon={starOutline} />+{mission.points} pts</span>
        {completed ? (
          <span className="chip done">Completada</span>
        ) : locked ? (
          <span className="chip locked">Bloqueada</span>
        ) : (
          <span className="chip pending">Pendiente</span>
        )}
      </div>
    </div>
    <IonIcon className="go" icon={completed ? checkmarkCircle : chevronForward} />
  </div>
);

export default MissionCard;
