import { useEffect, useRef, useState } from 'react';
import { STILL_SECONDS, STILL_THRESHOLD } from '../config/missions';
import useAccelerometer from './useAccelerometer';

// Cuenta STILL_SECONDS segundos mientras el celular esté quieto.
// Si el acelerómetro detecta movimiento, el conteo se reinicia.
// No bloquea la pantalla: usa un intervalo y el usuario puede seguir usando la app.
export default function useStillTimer(active: boolean) {
  const { accel, error } = useAccelerometer(active);
  const [remaining, setRemaining] = useState(STILL_SECONDS);
  const [resets, setResets] = useState(0);
  const [done, setDone] = useState(false);
  const [sensorSeen, setSensorSeen] = useState(false);
  const startRef = useRef(0);
  const baseline = useRef<{ x: number; y: number; z: number } | null>(null);

  // Temporizador
  useEffect(() => {
    if (!active) {
      setRemaining(STILL_SECONDS);
      setDone(false);
      setSensorSeen(false);
      baseline.current = null;
      return;
    }
    startRef.current = Date.now();
    setDone(false);
    const id = window.setInterval(() => {
      const rem = Math.max(0, STILL_SECONDS - (Date.now() - startRef.current) / 1000);
      setRemaining(rem);
      if (rem <= 0) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [active]);

  // Detección de movimiento con el acelerómetro (filtro de paso bajo)
  useEffect(() => {
    if (!active || done || !accel) return;
    setSensorSeen(true);
    const b = baseline.current;
    if (!b) {
      baseline.current = { x: accel.x, y: accel.y, z: accel.z };
      return;
    }
    const delta = Math.sqrt((accel.x - b.x) ** 2 + (accel.y - b.y) ** 2 + (accel.z - b.z) ** 2);
    baseline.current = {
      x: b.x * 0.85 + accel.x * 0.15,
      y: b.y * 0.85 + accel.y * 0.15,
      z: b.z * 0.85 + accel.z * 0.15,
    };
    if (delta > STILL_THRESHOLD) {
      startRef.current = Date.now(); // ¡se movió! reiniciar
      setRemaining(STILL_SECONDS);
      setResets((r) => r + 1);
    }
  }, [accel, active, done]);

  // Para el modo demo: simula un movimiento
  const simulateMove = () => {
    startRef.current = Date.now();
    setRemaining(STILL_SECONDS);
    setResets((r) => r + 1);
  };

  return { remaining, done, resets, sensorSeen, error, simulateMove };
}
