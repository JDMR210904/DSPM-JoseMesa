import React from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from './App';

// Necesario para que la cámara funcione en el navegador (en el celular usa la nativa)
defineCustomElements(window);

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
