import { useEffect, useState } from 'react';
import { Motion } from '@capacitor/motion';

export interface Vec3 { x: number; y: number; z: number; t: number }

// iPhone (Safari) exige pedir el permiso de movimiento DENTRO de un toque del usuario.
// Se llama desde el botón "Iniciar conteo". En Android y PC no hace nada.
export async function requestMotionPermission(): Promise<boolean> {
  const DME = (window as any).DeviceMotionEvent;
  if (DME && typeof DME.requestPermission === 'function') {
    try {
      return (await DME.requestPermission()) === 'granted';
    } catch {
      return false;
    }
  }
  return true;
}

// Lee el acelerómetro mientras "active" sea true
export default function useAccelerometer(active: boolean) {
  const [accel, setAccel] = useState<Vec3 | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let handle: { remove: () => Promise<void> } | null = null;

    (async () => {
      try {
        const h = await Motion.addListener('accel', (e) => {
          const g = e.accelerationIncludingGravity;
          // En PC sin sensor llegan valores null: se ignoran
          if (g && g.x != null && g.y != null && g.z != null) {
            setAccel({ x: g.x, y: g.y, z: g.z, t: Date.now() });
          }
        });
        if (cancelled) h.remove();
        else handle = h;
      } catch (e: any) {
        setError(e?.message ?? 'Acelerómetro no disponible');
      }
    })();

    return () => {
      cancelled = true;
      handle?.remove();
      setAccel(null);
    };
  }, [active]);

  return { accel, error };
}
