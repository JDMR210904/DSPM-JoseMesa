# Challenge 08 — Supabase: tareas con RLS, avatar en Storage, Realtime y cámara

Ionic + React + TypeScript.

## Configuración de Supabase
1. https://supabase.com → **New project** (plan Free, región São Paulo).
2. **SQL Editor** → pega y ejecuta `supabase/schema.sql` (crea la tabla `tareas`, políticas RLS, Realtime y el bucket `avatars` con sus políticas).
3. **Authentication → Sign In / Providers → Email** habilitado. Para desarrollo puedes desactivar *Confirm email*. En *URL Configuration* pon `http://localhost:5173`.
4. **Project Settings → API Keys**: copia *Project URL* y la *publishable key* (`sb_publishable_...`).
5. Copia `.env.example` a `.env` y pega los valores. **Nunca uses la secret/service_role key en el frontend.**

## Ejecutar
```bash
npm install
npm run dev
```

## Qué pide el enunciado y dónde está
| Requisito | Archivo |
|---|---|
| 1. Proyecto, tabla con RLS, bucket `avatars` | `supabase/schema.sql` |
| 2. Registro y login | `hooks/useAuth.ts`, `pages/Login.tsx`, `pages/Register.tsx` |
| 2. CRUD | `hooks/useTareas.ts` (add, toggle, rename, remove) |
| 2. Lista en vivo | `hooks/useTareas.ts` (canal `postgres_changes`) — abre dos pestañas y verás los cambios al instante |
| 3. Componentes Ionic + foto con cámara | `pages/Tareas.tsx`, `hooks/useAvatar.ts` (`@capacitor/camera` → sube a `avatars/<user_id>/avatar.jpg`) |

## Notas
- La tabla se llama `tareas` (igual que en las diapositivas).
- El bucket es público para mostrar el avatar con su URL; solo el dueño puede subir, reemplazar o borrar (políticas por carpeta).
- En Android/iOS: `npm run build && npx cap add android && npx cap sync` y permiso `CAMERA`.
