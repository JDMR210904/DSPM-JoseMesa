# Challenge 05 — Tasks App con Firebase Login/Register, Contexts y Custom Hooks

Ionic + React + TypeScript. Transforma la Tasks App del Challenge 03 agregando autenticación con Firebase.

## Configuración de Firebase (una sola vez)
1. https://console.firebase.google.com → **Crear proyecto**.
2. **Authentication → Método de acceso → Correo electrónico/contraseña → Habilitar**.
3. Configuración del proyecto → **Agregar app web (`</>`)** → copia el `firebaseConfig`.
4. Copia `.env.example` a `.env` y pega los valores (las claves NO se suben a git).

## Ejecutar
```bash
npm install
npm run dev      # http://localhost:5173
```

## Qué pide el enunciado y dónde está
| Requisito | Archivo |
|---|---|
| Login / Register / Logout con Firebase | `hooks/useAuth.ts` (usa `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`) |
| Páginas: Login, Register, lista, Agregar/Editar, Detalle | `pages/Login, Register, TaskList, TaskForm, TaskDetail` |
| Un contexto para las tareas | `context/TasksContext.tsx` |
| Otro contexto para login/registro | `context/AuthContext.tsx` |
| Custom hooks para la lógica de Firebase | `hooks/useAuth.ts` (+ `useTasks`, `useLocalStorage`) |

## Rutas
`/login`, `/register`, `/tasks`, `/task-new`, `/task/:id`, `/task-edit/:id`. Las de tareas son privadas (sin sesión redirigen a `/login`).

## Notas
- Las tareas se guardan en `localStorage` por usuario (clave `tasks_<uid>`), como en el Challenge 03.
- `TasksProvider` va dentro de `AuthProvider` porque necesita el uid del usuario.
