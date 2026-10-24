import {
  IonBadge, IonButton, IonButtons, IonCheckbox, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem,
  IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { add, logOutOutline, trashOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useTasksContext } from '../context/TasksContext';

const TaskList: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { tasks, toggleTask, deleteTask } = useTasksContext();
  const history = useHistory();

  const pending = tasks.filter((t) => !t.completed).length;

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            Mis tareas <IonBadge color="light">{pending}</IonBadge>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}><IonIcon slot="icon-only" icon={logOutOutline} /></IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem lines="none"><IonLabel color="medium">Sesión: {user?.email}</IonLabel></IonItem>
        {tasks.length === 0 && <p className="ion-padding ion-text-center">No hay tareas. Toca + para crear una.</p>}
        <IonList>
          {tasks.map((t) => (
            <IonItemSliding key={t.id}>
              <IonItem button detail onClick={() => history.push(`/task/${t.id}`)}>
                <IonCheckbox
                  slot="start" checked={t.completed}
                  onClick={(e) => e.stopPropagation()} onIonChange={() => toggleTask(t.id)}
                />
                <IonLabel style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</IonLabel>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => deleteTask(t.id)}>
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => history.push('/task-new')}><IonIcon icon={add} /></IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default TaskList;
