# Challenge 06 — Contactos (Firestore) + Tareas (Realtime DB) + Frutas (Dexie) + red

Ionic + React + TypeScript, con login real de Firebase y 3 pestañas.

## Configuración de Firebase (una sola vez)
1. https://console.firebase.google.com → **Crear proyecto**.
2. **Authentication → Método de acceso → Correo electrónico/contraseña → Habilitar**.
3. Configuración del proyecto → **Agregar app web (`</>`)** → copia el `firebaseConfig`.
4. Copia `.env.example` a `.env` y pega los valores (las claves NO se suben a git).
5. **Firestore Database → Crear base de datos** (modo de prueba para desarrollo) → colección `contactos`.
6. **Realtime Database → Crear base de datos** (modo de prueba) → copia la URL en `VITE_FIREBASE_DATABASE_URL`.

> Las reglas en "modo de prueba" son abiertas y caducan en 30 días. Para producción restringe a `request.auth != null`.

## Ejecutar
```bash
npm install
npm run dev
```

## Qué pide el enunciado y dónde está
| Requisito | Archivo |
|---|---|
| Login real y rutas | `pages/Login, Register`, `App.tsx`, `pages/Tabs.tsx` (`/tabs/contacts\|tasks\|fruits`) |
| a. Contactos en Firebase (Firestore) | `hooks/useCollection.ts` + `pages/Contacts.tsx` |
| b. Tareas en Realtime DB | `hooks/useRealTimeCollection.ts` (con `onValue`) + `pages/Tasks.tsx` |
| c. Frutas en Dexie | `db/dexie.ts` (v1 y v2) + `hooks/useDexie.ts` (con `useLiveQuery`) + `pages/Fruits.tsx` |
| Validar red y habilitar/deshabilitar acciones | `hooks/useNetwork.ts` (`@capacitor/network`) + `context/NetworkContext.tsx` |

## Comportamiento sin conexión
- **Contactos y Tareas:** inputs y botones deshabilitados + banner amarillo.
- **Frutas (Dexie):** sigue funcionando, es local.

## Nota sobre "Fruits in Dexie - newFunction"
El enunciado no detalla qué es la "newFunction". Lo interpreté como la **versión 2 del esquema de Dexie** de las diapositivas (campos nuevos `proveedor` y `fechaCosecha`). Si tu profesor se refería a otra cosa, avísame y lo ajusto.
