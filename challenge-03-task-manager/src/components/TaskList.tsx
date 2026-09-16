import React from "react";
import { IonList } from "@ionic/react";
import TaskItem, { type Task } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// Componente intermedio: recibe la lista completa y la reparte a cada TaskItem
const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
  if (tasks.length === 0) {
    return <p className="ion-padding ion-text-center">No hay tareas todavía.</p>;
  }

  return (
    <IonList>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </IonList>
  );
};

export default TaskList;
