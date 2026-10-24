import React from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App';

// Permite usar la cámara también en el navegador
defineCustomElements(window);

// En la versión web (Netlify) se registra un service worker para poder mostrar notificaciones
if (!Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => undefined);
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
