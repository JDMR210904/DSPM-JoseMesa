import { createContext, ReactNode, useContext } from 'react';
import useNetwork from '../hooks/useNetwork';

type NetworkContextType = ReturnType<typeof useNetwork>;
const NetworkContext = createContext<NetworkContextType>({ connected: true, connectionType: 'unknown' });

export function NetworkProvider({ children }: { children: ReactNode }) {
  const network = useNetwork();
  return <NetworkContext.Provider value={network}>{children}</NetworkContext.Provider>;
}

export const useNetworkContext = () => useContext(NetworkContext);
