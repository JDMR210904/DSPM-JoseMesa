import { useEffect, useState } from 'react';
import { Motion } from '@capacitor/motion';

export interface AccelData { x: number; y: number; z: number }
export interface OrientationData { alpha: number; beta: number; gamma: number }

export default function useAccelerometer() {
  const [accel, setAccel] = useState<AccelData | null>(null);
  const [orientation, setOrientation] = useState<OrientationData | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const handles: { remove: () => Promise<void> }[] = [];

    (async () => {
      try {
        // En iOS 13+ hay que pedir permiso explícito (debe originarse en un gesto del usuario)
        const DME = (window as any).DeviceMotionEvent;
        if (DME && typeof DME.requestPermission === 'function') {
          const res = await DME.requestPermission();
          if (res !== 'granted') throw new Error('Permiso de movimiento denegado');
        }
        const a = await Motion.addListener('accel', (e) => {
          const g = e.accelerationIncludingGravity;
          // En PC sin sensor el navegador envía valores null: se ignoran
          if (g && g.x != null && g.y != null && g.z != null) setAccel({ x: g.x, y: g.y, z: g.z });
        });
        const o = await Motion.addListener('orientation', (e) => {
          if (e.alpha != null && e.beta != null && e.gamma != null) setOrientation({ alpha: e.alpha, beta: e.beta, gamma: e.gamma });
        });
        if (cancelled) { a.remove(); o.remove(); } else handles.push(a, o);
      } catch (e: any) {
        setError(e.message);
        setActive(false);
      }
    })();

    return () => {
      cancelled = true;
      handles.forEach((h) => h.remove());
    };
  }, [active]);

  return { accel, orientation, active, error, start: () => { setError(null); setActive(true); }, stop: () => setActive(false) };
}
