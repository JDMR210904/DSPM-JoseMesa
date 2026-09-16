import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBadge,
} from "@ionic/react";
import AddTaskForm from "../components/AddTaskForm";
import TaskList from "../components/TaskList";
import type { Task } from "../components/TaskItem";

const STORAGE_KEY = "tasks";

// Componente PADRE: guarda el estado de las tareas y las funciones que lo modifican
const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Efecto: cargar tareas guardadas al montar el componente (solo una vez, [])
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Efecto: guardar en localStorage cada vez que la lista de tareas cambia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };
    // nunca se muta el estado directamente, siempre se crea un nuevo arreglo
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Task Manager{" "}
            {tasks.length > 0 && <IonBadge color="primary">{pendingCount}</IonBadge>}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <AddTaskForm onAdd={addTask} />
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      </IonContent>
    </IonPage>
  );
};

export default TaskManager;
