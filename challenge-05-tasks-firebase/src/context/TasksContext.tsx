import { createContext, ReactNode, useContext } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuthContext } from './AuthContext';

type TasksContextType = ReturnType<typeof useTasks>;

export const TasksContext = createContext<TasksContextType | null>(null);

// Este provider va DENTRO de AuthProvider porque necesita el usuario actual
export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const tasks = useTasks(user?.uid);
  return <TasksContext.Provider value={tasks}>{children}</TasksContext.Provider>;
}

export function useTasksContext() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasksContext debe usarse dentro de <TasksProvider>');
  return ctx;
}
