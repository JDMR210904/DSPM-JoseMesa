import {
  IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonContent,
  IonHeader, IonIcon, IonPage, IonTitle, IonToolbar,
} from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { useTasksContext } from '../context/TasksContext';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTask, toggleTask, deleteTask } = useTasksContext();
  const history = useHistory();
  const task = getTask(id);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start"><IonBackButton defaultHref="/tasks" /></IonButtons>
          <IonTitle>Detalle</IonTitle>
          {task && (
            <IonButtons slot="end">
              <IonButton onClick={() => history.push(`/task-edit/${task.id}`)}>
                <IonIcon slot="icon-only" icon={createOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!task ? (
          <p>La tarea no existe.</p>
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{task.title}</IonCardTitle>
              <IonChip color={task.completed ? 'success' : 'warning'}>
                {task.completed ? 'Completada' : 'Pendiente'}
              </IonChip>
            </IonCardHeader>
            <IonCardContent>
              <p>{task.description || 'Sin descripción'}</p>
              <p><small>Creada: {new Date(task.createdAt).toLocaleString()}</small></p>
              <IonButton expand="block" onClick={() => toggleTask(task.id)}>
                Marcar como {task.completed ? 'pendiente' : 'completada'}
              </IonButton>
              <IonButton
                expand="block" color="danger" fill="outline"
                onClick={() => { deleteTask(task.id); history.replace('/tasks'); }}
              >
                <IonIcon slot="start" icon={trashOutline} /> Eliminar
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TaskDetail;
