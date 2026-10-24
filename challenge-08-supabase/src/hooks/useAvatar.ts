import { useCallback, useEffect, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { supabase } from '../lib/supabase';

// Foto de perfil: se toma con la cámara y se sube al bucket "avatars" en <user_id>/avatar.jpg
export default function useAvatar(userId: string | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const path = userId ? `${userId}/avatar.jpg` : '';

  const refresh = useCallback(async () => {
    if (!userId) return;
    // Se verifica que el archivo exista en la carpeta del usuario
    const { data } = await supabase.storage.from('avatars').list(userId);
    if (data?.some((f) => f.name === 'avatar.jpg')) {
      const pub = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
      setUrl(`${pub}?t=${Date.now()}`); // evita la caché al reemplazar la imagen
    } else {
      setUrl(null);
    }
  }, [userId, path]);

  useEffect(() => { refresh(); }, [refresh]);

  const takeAndUpload = async (source: CameraSource = CameraSource.Camera) => {
    if (!userId) return;
    setError(null);
    try {
      const photo = await Camera.getPhoto({ quality: 80, width: 600, resultType: CameraResultType.DataUrl, source });
      if (!photo.dataUrl) return;
      setUploading(true);
      const blob = await (await fetch(photo.dataUrl)).blob();
      const { error } = await supabase.storage.from('avatars').upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
      if (error) throw error;
      await refresh();
    } catch (e: any) {
      if (!/cancel/i.test(e.message)) setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return { url, uploading, error, takePhoto: () => takeAndUpload(CameraSource.Camera), pickPhoto: () => takeAndUpload(CameraSource.Photos) };
}
