import React from "react";
import {
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { trashOutline } from "ionicons/icons";

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onIonChange={() => onToggle(task.id)}
      />
      <IonLabel
        style={{
          textDecoration: task.completed ? "line-through" : "none",
          color: task.completed ? "var(--ion-color-medium)" : undefined,
        }}
      >
        {task.title}
      </IonLabel>
      <IonButton
        slot="end"
        fill="clear"
        color="danger"
        onClick={() => onDelete(task.id)}
      >
        <IonIcon icon={trashOutline} />
      </IonButton>
    </IonItem>
  );
};

export default TaskItem;