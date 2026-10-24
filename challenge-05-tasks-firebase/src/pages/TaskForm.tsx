import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonPage, IonTextarea, IonTitle, IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTasksContext } from '../context/TasksContext';

// Una sola pantalla para crear (/tasks/new) y editar (/tasks/:id/edit)
const TaskForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { getTask, addTask, updateTask } = useTasksContext();
  const history = useHistory();
  const editing = id ? getTask(id) : undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description);
    }
  }, [editing?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = () => {
    if (!title.trim()) return;
    if (editing) updateTask(editing.id, { title: title.trim(), description });
    else addTask(title.trim(), description);
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start"><IonBackButton defaultHref="/tasks" /></IonButtons>
          <IonTitle>{editing ? 'Editar tarea' : 'Nueva tarea'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          label="Título" labelPlacement="floating" fill="outline"
          value={title} onIonInput={(e) => setTitle(e.detail.value ?? '')}
        />
        <IonTextarea
          className="ion-margin-top" label="Descripción" labelPlacement="floating" fill="outline" rows={5}
          value={description} onIonInput={(e) => setDescription(e.detail.value ?? '')}
        />
        <IonButton expand="block" className="ion-margin-top" onClick={save} disabled={!title.trim()}>
          Guardar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default TaskForm;
