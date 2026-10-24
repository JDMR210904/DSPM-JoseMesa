import { createContext, ReactNode, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

type AuthContextType = ReturnType<typeof useAuth>;

// 1. Crear el contexto
export const AuthContext = createContext<AuthContextType | null>(null);

// 2. Provider: la lógica vive en el custom hook useAuth
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// 4. Consumir el contexto
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>');
  return ctx;
}
