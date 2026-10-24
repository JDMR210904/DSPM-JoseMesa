import { useLocalStorage } from './useLocalStorage';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

// Custom hook: lógica de las tareas (cada usuario tiene su propia lista)
export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useLocalStorage<Task[]>(`tasks_${userId ?? 'anon'}`, []);

  const addTask = (title: string, description: string) =>
    setTasks((prev) => [
      { id: crypto.randomUUID(), title, description, completed: false, createdAt: new Date().toISOString() },
      ...prev,
    ]);

  const updateTask = (id: string, data: Partial<Omit<Task, 'id'>>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const getTask = (id: string) => tasks.find((t) => t.id === id);

  return { tasks, addTask, updateTask, toggleTask, deleteTask, getTask };
}
