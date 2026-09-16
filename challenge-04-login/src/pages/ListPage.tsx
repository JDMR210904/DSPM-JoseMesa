import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
} from "@ionic/react";
import { logOutOutline, checkmarkCircleOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";

const ListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("logged");
    navigate("/login");
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="tertiary">
          <IonTitle>Mi Cuenta</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="welcome-bg">
        <div className="welcome-wrapper">
          <IonIcon icon={checkmarkCircleOutline} className="welcome-icon" />
          <h2>¡Bienvenido!</h2>
          <p>Ya iniciaste sesión correctamente.</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ListPage;
