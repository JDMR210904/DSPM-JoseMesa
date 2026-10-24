import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Toma una foto con la cámara del dispositivo y la devuelve como dataUrl
export default function useCamera() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = async () => {
    setError(null);
    try {
      const img = await Camera.getPhoto({
        quality: 85,
        width: 1280,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: false,
      });
      setPhoto(img.dataUrl ?? null);
      return img.dataUrl ?? null;
    } catch (e: any) {
      if (!/cancel/i.test(e?.message ?? '')) setError(e?.message ?? 'No se pudo abrir la cámara');
      return null;
    }
  };

  return { photo, setPhoto, error, takePhoto };
}
