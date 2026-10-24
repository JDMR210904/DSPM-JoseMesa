import { cameraOutline, footstepsOutline, hourglassOutline } from 'ionicons/icons';

// ── Parámetros de las misiones (cámbialos aquí si el profesor pide otros valores) ──
export const MOVE_TARGET_METERS = 50;      // distancia a recorrer en la misión 2
export const MAX_GPS_ACCURACY_METERS = 40; // se ignoran lecturas de GPS con peor precisión
export const STILL_SECONDS = 10;           // segundos quieto en la misión 3
export const STILL_THRESHOLD = 1.2;        // m/s² de cambio que cuenta como "moverse"

export type MissionKey = 'photo' | 'move' | 'still';

export interface MissionDef {
  id: number;
  key: MissionKey;
  title: string;
  description: string;
  points: number;
  route: string;
  icon: string;
  gradient: string;   // degradado de la tarjeta
  glow: string;       // color del brillo
  requires?: number;  // id de la misión que debe completarse antes
}

export const MISSIONS: MissionDef[] = [
  {
    id: 1,
    key: 'photo',
    title: 'Evidencia',
    description: 'Toma una foto con la cámara y guárdala',
    points: 40,
    route: '/mission-photo',
    icon: cameraOutline,
    gradient: 'linear-gradient(135deg, #ff3d81 0%, #ff8a3d 100%)',
    glow: '#ff3d81',
  },
  {
    id: 2,
    key: 'move',
    title: 'Movimiento real',
    description: `Muévete ${MOVE_TARGET_METERS} metros de tu posición original`,
    points: 50,
    route: '/mission-move',
    icon: footstepsOutline,
    gradient: 'linear-gradient(135deg, #00e0ff 0%, #3d5afe 100%)',
    glow: '#00e0ff',
  },
  {
    id: 3,
    key: 'still',
    title: 'Permanencia activa',
    description: `Quédate quieto ${STILL_SECONDS} segundos y el celular vibrará`,
    points: 30,
    route: '/mission-still',
    icon: hourglassOutline,
    gradient: 'linear-gradient(135deg, #b14dff 0%, #6a3dff 100%)',
    glow: '#b14dff',
    requires: 2,
  },
];

export const TOTAL_POINTS = MISSIONS.reduce((sum, m) => sum + m.points, 0); // 120

export const getMission = (id: number) => MISSIONS.find((m) => m.id === id)!;
