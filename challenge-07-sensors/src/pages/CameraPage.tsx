import { IonButton, IonImg } from '@ionic/react';
import useCamera from '../hooks/useCamera';
import SensorPage from './SensorPage';

const CameraPage: React.FC = () => {
  const { photo, error, takePhoto, pickFromGallery } = useCamera();
  return (
    <SensorPage title="Cámara" error={error}>
      <IonButton expand="block" onClick={takePhoto}>Tomar foto</IonButton>
      <IonButton expand="block" color="secondary" onClick={pickFromGallery}>Elegir de la galería</IonButton>
      {photo && <IonImg src={photo} alt="Foto capturada" />}
    </SensorPage>
  );
};

export default CameraPage;
