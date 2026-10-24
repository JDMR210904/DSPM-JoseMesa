import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export default function useCamera() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPhoto = async (source: CameraSource = CameraSource.Camera) => {
    setError(null);
    try {
      const image = await Camera.getPhoto({ quality: 80, resultType: CameraResultType.DataUrl, source });
      setPhoto(image.dataUrl ?? null);
    } catch (e: any) {
      if (!/cancel/i.test(e.message)) setError(e.message); // cancelar no es un error
    }
  };

  return { photo, error, takePhoto: () => getPhoto(CameraSource.Camera), pickFromGallery: () => getPhoto(CameraSource.Photos) };
}
