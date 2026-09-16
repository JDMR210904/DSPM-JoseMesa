const AUTH_KEY = 'pwa_auth';
const PATIENTS_KEY = 'pwa_patients';

export function getAuth() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setAuth(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function getPatients() {
  const raw = localStorage.getItem(PATIENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function savePatients(patients) {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
}
