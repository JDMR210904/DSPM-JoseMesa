import { IonApp, IonRouterOutlet, IonSpinner, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/global.css';

import Confetti from './components/Confetti';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import Login from './pages/Login';
import MissionMove from './pages/MissionMove';
import MissionPhoto from './pages/MissionPhoto';
import MissionStill from './pages/MissionStill';
import Register from './pages/Register';
import Tabs from './pages/Tabs';

setupIonicReact({ mode: 'ios' });

// Rutas: todas distintas entre sí para que Ionic no las confunda
const Routes: React.FC = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div className="spinner-page"><IonSpinner name="crescent" /></div>;
  }

  const guard = (C: React.ComponentType) => () => (user ? <C /> : <Redirect to="/login" />);

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" render={() => (user ? <Redirect to="/tabs/missions" /> : <Login />)} />
        <Route exact path="/register" render={() => (user ? <Redirect to="/tabs/missions" /> : <Register />)} />
        <Route path="/tabs" render={guard(Tabs)} />
        <Route exact path="/mission-photo" render={guard(MissionPhoto)} />
        <Route exact path="/mission-move" render={guard(MissionMove)} />
        <Route exact path="/mission-still" render={guard(MissionStill)} />
        <Route exact path="/"><Redirect to="/tabs/missions" /></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <ProgressProvider>
        <Routes />
        <Confetti />
      </ProgressProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
