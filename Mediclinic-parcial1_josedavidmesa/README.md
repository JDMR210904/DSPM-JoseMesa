# Parcial 1 — Desarrollo de Plataformas Móviles — MediClinic

Repositorio con las dos aplicaciones pedidas en el parcial: una **PWA en React**
(`/pwa`) y una **app móvil en Ionic React** (`/ionic`). No usan backend: toda la
persistencia es con `localStorage`, y ninguna de las dos apps comparte datos
de pacientes con la otra (usan claves de `localStorage` distintas).

Rama de entrega: `parcial-1-nombre-apellido` *(reemplaza con tu nombre real
antes de crear la rama, ver instrucciones al final)*.

---

## 📱 `/pwa` — Ejercicio 1: PWA React

App de administración de pacientes.

**Funcionalidad:**
- **Login**: usuario fijo (`admin` / `clinica123`). Si es correcto, guarda la
  sesión en `localStorage` (`pwa_auth`); al recargar, la recupera
  automáticamente. Botón para cerrar sesión. Si las credenciales son
  incorrectas, muestra un mensaje de error en pantalla.
- **Pacientes**: lista de pacientes + formulario para agregar (nombre,
  apellido, CC, teléfono), con validación de nombre, apellido y CC (solo
  números, 6-10 dígitos). Se guardan en `localStorage` (`pwa_patients`).
- **Búsqueda**: el estado del buscador vive en el componente padre
  (`Home.jsx`); la lista ya filtrada se pasa como prop al componente hijo
  `PatientList`, que solo la muestra.
- **PWA**: `manifest.json` + `service-worker.js` con estrategia híbrida
  (igual a la vista en clase): HTML → Network First, JS/CSS → Cache First,
  imágenes → Cache First + Stale While Revalidate.

**Estructura:**
```
pwa/
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   └── icon-192.png, icon-512.png
└── src/
    ├── components/
    │   ├── Login.jsx
    │   ├── SearchBar.jsx
    │   ├── PatientForm.jsx
    │   ├── PatientList.jsx
    │   └── PatientItem.jsx
    ├── pages/Home.jsx
    ├── utils/storage.js
    ├── App.jsx
    └── main.jsx
```

**Correr en local:**
```bash
cd pwa
npm install
npm run dev
```

**Build / preview (para probar la PWA offline):**
```bash
npm run build
npm run preview
```

---

## 🏥 `/ionic` — Ejercicio 2: Ionic React

App móvil (con Tabs) para que un médico consulte sus visitas del día.

**Funcionalidad:**
- **Login**: componentes de Ionic (`IonInput`, `IonButton`). Usuario fijo
  (`medico` / `medico123`). Si falla, muestra un `IonToast`. Guarda la sesión
  en `localStorage` (`ionic_auth`).
- **Navegación**: después del login, `IonTabs` con **Visitas**, **Pacientes**
  y **Perfil** (`Tabs.tsx`), usando `IonReactRouter`.
- **Visitas**: lista las visitas del día (paciente, hora, estado) guardadas en
  `localStorage` (`ionic_visits`, con datos semilla la primera vez). Al tocar
  una visita, navega al detalle por ruta dinámica (`/tabs/visitas/:id` +
  `useParams`). En el detalle se puede avanzar el estado
  `pendiente → en_camino → finalizada`, y el cambio se guarda en
  `localStorage`.
- **Pacientes**: lista de pacientes de ejemplo (`localStorage` separado:
  `ionic_patients`, sin relación con los de la PWA).
- **Perfil**: muestra el usuario logueado y permite cerrar sesión.

**Estructura:**
```
ionic/
├── capacitor.config.ts
└── src/
    ├── pages/
    │   ├── Login.tsx
    │   ├── Tabs.tsx
    │   ├── Visitas.tsx
    │   ├── VisitDetail.tsx
    │   ├── Pacientes.tsx
    │   └── Perfil.tsx
    ├── utils/storage.ts
    ├── theme/variables.css
    ├── App.tsx
    └── main.tsx
```

**Correr en local (navegador):**
```bash
cd ionic
npm install
npm run dev
```

**Llevar a Android / iOS (como en clase):**
```bash
npm run build
npx cap add android      # o: npx cap add ios
npx cap copy
npx cap sync
npx cap open android      # o: npx cap open ios
```

---

## Capturas de pantalla

*(Pendiente: correr `npm run dev` en cada carpeta, abrir la app en el
navegador / emulador y agregar aquí los pantallazos de Login, Pacientes /
Búsqueda, Visitas y Detalle de visita, como pide la entrega.)*

---

## Cómo crear la rama de entrega

Desde la raíz del repositorio ya existente (o de este nuevo repo si decides
usarlo directamente):

```bash
git checkout -b parcial-1-tu-nombre-tu-apellido
git add pwa ionic README.md
git commit -m "Parcial 1: PWA y Ionic MediClinic"
git push origin parcial-1-tu-nombre-tu-apellido
```

## Condiciones cumplidas
- ✅ Sin backend: todo con `localStorage`.
- ✅ Las dos apps no comparten información de pacientes (claves de
  `localStorage` distintas: `pwa_patients` vs `ionic_patients`).
