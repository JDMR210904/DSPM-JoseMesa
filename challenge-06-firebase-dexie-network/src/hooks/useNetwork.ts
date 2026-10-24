import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

// Detecta si hay conexión: estado inicial (getStatus) + cambios (networkStatusChange)
export default function useNetwork() {
  const [connected, setConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    let remove: (() => void) | undefined;
    let cancelled = false;

    Network.getStatus().then((s) => {
      if (cancelled) return;
      setConnected(s.connected);
      setConnectionType(s.connectionType);
    });

    Network.addListener('networkStatusChange', (s) => {
      setConnected(s.connected);
      setConnectionType(s.connectionType);
    }).then((handle) => {
      if (cancelled) handle.remove();
      else remove = () => handle.remove();
    });

    return () => {
      cancelled = true;
      remove?.();
    };
  }, []);

  return { connected, connectionType };
}
