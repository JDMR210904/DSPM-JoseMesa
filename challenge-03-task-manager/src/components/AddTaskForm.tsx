import React, { useState } from "react";
import { IonItem, IonInput, IonButton, IonIcon } from "@ionic/react";
import { addOutline } from "ionicons/icons";

interface AddTaskFormProps {
  onAdd: (title: string) => void;
}

// Componente hijo: maneja su propio estado del input y avisa al padre al enviar
const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    const trimmed = title.trim();
    if (trimmed.length === 0) return;
    onAdd(trimmed);
    setTitle("");
  };

  return (
    <IonItem>
      <IonInput
        placeholder="Nueva tarea..."
        value={title}
        onIonInput={(e) => setTitle(e.detail.value ?? "")}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
      />
      <IonButton slot="end" onClick={handleAdd}>
        <IonIcon icon={addOutline} />
      </IonButton>
    </IonItem>
  );
};

export default AddTaskForm;
