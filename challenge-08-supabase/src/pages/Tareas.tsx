import {
  IonAvatar, IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem,
  IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonPage, IonSpinner, IonText, IonTitle,
  IonToolbar, useIonAlert,
} from '@ionic/react';
import { cameraOutline, createOutline, logOutOutline, personCircleOutline, trashOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import useAvatar from '../hooks/useAvatar';
import useTareas from '../hooks/useTareas';

const Tareas: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { tareas, loading, error, add, toggle, rename, remove } = useTareas(user?.id);
  const avatar = useAvatar(user?.id);
  const history = useHistory();
  const [present] = useIonAlert();
  const [titulo, setTitulo] = useState('');

  const handleAdd = async () => {
    if (!titulo.trim()) return;
    if (await add(titulo.trim())) setTitulo('');
  };

  const handleRename = (id: number, current: string) =>
    present({
      header: 'Editar tarea',
      inputs: [{ name: 'titulo', type: 'text', value: current }],
      buttons: ['Cancelar', { text: 'Guardar', handler: (d) => { if (d.titulo?.trim()) rename(id, d.titulo.trim()); } }],
    });

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mis tareas</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}><IonIcon slot="icon-only" icon={logOutOutline} /></IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Perfil con foto tomada con la cámara */}
        <IonItem lines="full">
          <IonAvatar slot="start" onClick={avatar.takePhoto} style={{ cursor: 'pointer' }}>
            {avatar.url ? <IonImg src={avatar.url} alt="avatar" /> : <IonIcon icon={personCircleOutline} style={{ fontSize: 48 }} />}
          </IonAvatar>
          <IonLabel>
            <h2>{user?.email}</h2>
            <p>{avatar.uploading ? 'Subiendo foto…' : 'Toca la foto para cambiarla'}</p>
          </IonLabel>
          <IonButton slot="end" fill="clear" onClick={avatar.takePhoto} disabled={avatar.uploading}>
            <IonIcon slot="icon-only" icon={cameraOutline} />
          </IonButton>
        </IonItem>
        {avatar.error && <IonText color="danger"><p className="ion-padding-horizontal">{avatar.error}</p></IonText>}

        <div className="ion-padding">
          <IonInput label="Nueva tarea" labelPlacement="floating" fill="outline" value={titulo}
            onIonInput={(e) => setTitulo(e.detail.value ?? '')} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
          <IonButton expand="block" className="ion-margin-top" onClick={handleAdd} disabled={!titulo.trim()}>Agregar</IonButton>
          {error && <IonText color="danger"><p>{error}</p></IonText>}
        </div>

        {loading && <div className="ion-text-center"><IonSpinner /></div>}
        <IonList>
          {tareas.map((t) => (
            <IonItemSliding key={t.id}>
              <IonItem>
                <IonCheckbox slot="start" checked={t.completada} onIonChange={() => toggle(t)} />
                <IonLabel style={{ textDecoration: t.completada ? 'line-through' : 'none' }}>{t.titulo}</IonLabel>
                <IonButton slot="end" fill="clear" onClick={() => handleRename(t.id, t.titulo)}>
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => remove(t.id)}>
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
        {!loading && tareas.length === 0 && <p className="ion-text-center">Aún no tienes tareas.</p>}
      </IonContent>
    </IonPage>
  );
};

export default Tareas;
