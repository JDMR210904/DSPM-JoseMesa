import { useCallback, useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';

export interface Fix {
  lat: number;
  lng: number;
  accuracy: number;
  time: number;
}

// Sigue la posición del GPS en tiempo real (watchPosition)
export default function useGeolocation() {
  const [fix, setFix] = useState<Fix | null>(null);
  const [watching, setWatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<string | null>(null);

  const stop = useCallback(async () => {
    if (watchId.current) {
      await Geolocation.clearWatch({ id: watchId.current });
      watchId.current = null;
    }
    setWatching(false);
  }, []);

  const start = useCallback(async () => {
    if (watchId.current) return;
    setError(null);
    try {
      // En Android/iOS pide el permiso; en el navegador lo pide el propio navegador
      try {
        await Geolocation.requestPermissions();
      } catch {
        /* en web no está implementado: no pasa nada */
      }
      watchId.current = await Geolocation.watchPosition(
        { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
        (pos, err) => {
          if (err) {
            setError(err.message ?? 'Error de GPS');
            return;
          }
          if (pos) {
            setFix({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              time: pos.timestamp,
            });
          }
        }
      );
      setWatching(true);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo acceder a la ubicación');
    }
  }, []);

  useEffect(() => () => {
    if (watchId.current) Geolocation.clearWatch({ id: watchId.current });
  }, []);

  return { fix, watching, error, start, stop };
}
