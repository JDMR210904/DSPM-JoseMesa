import { IonButton, IonButtons, IonIcon, IonInput, IonItem, IonLabel, IonList, IonTextarea } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import useFilesystem from '../hooks/useFilesystem';
import SensorPage from './SensorPage';

const FilesystemPage: React.FC = () => {
  const { files, content, error, listFiles, writeFile, readFile, deleteFile } = useFilesystem();
  const [name, setName] = useState('nota.txt');
  const [text, setText] = useState('');

  useEffect(() => { listFiles(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SensorPage title="Archivos" error={error}>
      <IonInput label="Nombre del archivo" labelPlacement="floating" fill="outline" value={name}
        onIonInput={(e) => setName(e.detail.value ?? '')} />
      <IonTextarea className="ion-margin-top" label="Contenido" labelPlacement="floating" fill="outline" rows={4}
        value={text} onIonInput={(e) => setText(e.detail.value ?? '')} />
      <IonButton expand="block" className="ion-margin-top" disabled={!name.trim()} onClick={() => writeFile(name.trim(), text)}>
        Guardar archivo
      </IonButton>
      <IonList>
        {files.map((f) => (
          <IonItem key={f} button onClick={() => readFile(f)}>
            <IonLabel>{f}</IonLabel>
            <IonButtons slot="end">
              <IonButton color="danger" onClick={(e) => { e.stopPropagation(); deleteFile(f); }}>
                <IonIcon slot="icon-only" icon={trashOutline} />
              </IonButton>
            </IonButtons>
          </IonItem>
        ))}
      </IonList>
      {content && <IonItem><IonLabel className="ion-text-wrap"><h3>Contenido leído</h3><p>{content}</p></IonLabel></IonItem>}
    </SensorPage>
  );
};

export default FilesystemPage;
