# Challenge 07 — App de sensores (Capacitor)

Ionic + React + TypeScript. Home con **un botón por sensor** y **una página por sensor**, cada uno con su custom hook.

| Sensor | Plugin | Hook | Página |
|---|---|---|---|
| GPS | @capacitor/geolocation | useGeolocation | GeolocationPage |
| Cámara | @capacitor/camera | useCamera | CameraPage |
| Acelerómetro/orientación | @capacitor/motion | useAccelerometer | AccelerometerPage |
| Dispositivo/batería | @capacitor/device | useDevice | DevicePage |
| Vibración | @capacitor/haptics | useHaptics | HapticsPage |
| Archivos | @capacitor/filesystem | useFilesystem | FilesystemPage |
| Notif. locales | @capacitor/local-notifications | useLocalNotifications | LocalNotificationsPage |
| Notif. push | @capacitor/push-notifications | usePushNotifications | PushNotificationsPage |

## Ejecutar en el navegador
```bash
npm install
npm run dev
```
En el navegador funcionan GPS, cámara (vía pwa-elements), dispositivo, archivos y notificaciones locales. **Vibración, acelerómetro y push necesitan un dispositivo real.**

## Ejecutar en Android / iOS
```bash
npm run build
npx cap add android      # o: npx cap add ios
npx cap sync
npx cap open android
```
Permisos en Android (`android/app/src/main/AndroidManifest.xml`): `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `CAMERA`, `VIBRATE`, `POST_NOTIFICATIONS`. En iOS agrega en `Info.plist` las descripciones de cámara y ubicación.

## Push notifications
Requiere un proyecto de Firebase: registra la app Android, descarga `google-services.json` a `android/app/`, ejecuta la app, toca **Registrar dispositivo**, copia el token FCM y envía la prueba desde Firebase → Messaging.
