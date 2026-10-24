import { useEffect, useRef, useState } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';

export default function useGeolocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [watching, setWatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<string | null>(null);

  const getCurrentPosition = async () => {
    setError(null);
    try {
      setPosition(await Geolocation.getCurrentPosition({ enableHighAccuracy: true }));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const startWatching = async () => {
    if (watchId.current) return;
    setError(null);
    try {
      watchId.current = await Geolocation.watchPosition({ enableHighAccuracy: true }, (pos, err) => {
        if (err) setError(err.message);
        else if (pos) setPosition(pos);
      });
      setWatching(true);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const stopWatching = async () => {
    if (watchId.current) {
      await Geolocation.clearWatch({ id: watchId.current });
      watchId.current = null;
    }
    setWatching(false);
  };

  // Limpieza al salir de la página
  useEffect(() => () => { if (watchId.current) Geolocation.clearWatch({ id: watchId.current }); }, []);

  return { position, watching, error, getCurrentPosition, startWatching, stopWatching };
}
