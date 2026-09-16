import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";

const VALID_EMAIL = "jose@mail.com";
const VALID_PASSWORD = "mesa2026";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem("logged", "true");
      setError("");
      navigate("/list");
    } else {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-bg">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-avatar">
              <IonIcon icon={personCircleOutline} />
            </div>
            <h1 className="login-title">Hola de nuevo</h1>
            <p className="login-subtitle">Ingresa tus datos para continuar</p>

            <IonItem className="login-field" lines="none">
              <IonLabel position="stacked">Correo</IonLabel>
              <IonInput
                type="email"
                placeholder="usuario@correo.com"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value ?? "")}
              />
            </IonItem>

            <IonItem className="login-field" lines="none">
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                type="password"
                placeholder="••••••"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value ?? "")}
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p className="login-error">{error}</p>
              </IonText>
            )}

            <IonButton expand="block" className="login-button" onClick={handleLogin}>
              Entrar
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
