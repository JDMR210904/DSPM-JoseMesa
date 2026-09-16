const AUTH_KEY = 'ionic_auth';
const VISITS_KEY = 'ionic_visits';
const PATIENTS_KEY = 'ionic_patients';

export interface AuthUser {
  username: string;
}

export function getAuth(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setAuth(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export type EstadoVisita = 'pendiente' | 'en_camino' | 'finalizada';

export interface Visit {
  id: number;
  paciente: string;
  hora: string;
  estado: EstadoVisita;
}

// Datos semilla: se guardan la primera vez que se abre la app.
const SEED_VISITS: Visit[] = [
  { id: 1, paciente: 'Laura Gómez', hora: '08:00', estado: 'pendiente' },
  { id: 2, paciente: 'Carlos Pérez', hora: '09:30', estado: 'en_camino' },
  { id: 3, paciente: 'Ana Rodríguez', hora: '11:00', estado: 'finalizada' },
];

export function getVisits(): Visit[] {
  const raw = localStorage.getItem(VISITS_KEY);
  if (!raw) {
    localStorage.setItem(VISITS_KEY, JSON.stringify(SEED_VISITS));
    return SEED_VISITS;
  }
  return JSON.parse(raw);
}

export function saveVisits(visits: Visit[]) {
  localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
}

export interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  cc: string;
  telefono: string;
}

const SEED_PATIENTS: Patient[] = [
  { id: 1, nombre: 'Laura', apellido: 'Gómez', cc: '1002003001', telefono: '3001112233' },
  { id: 2, nombre: 'Carlos', apellido: 'Pérez', cc: '1002003002', telefono: '3004445566' },
  { id: 3, nombre: 'Ana', apellido: 'Rodríguez', cc: '1002003003', telefono: '3007778899' },
];

export function getPatients(): Patient[] {
  const raw = localStorage.getItem(PATIENTS_KEY);
  if (!raw) {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(SEED_PATIENTS));
    return SEED_PATIENTS;
  }
  return JSON.parse(raw);
}
