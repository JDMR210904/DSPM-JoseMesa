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

import { AuthProvider, useAuthContext } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Tabs from './pages/Tabs';

setupIonicReact();

const Routes: React.FC = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}><IonSpinner /></div>;
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" render={() => (user ? <Redirect to="/tabs/contacts" /> : <Login />)} />
        <Route exact path="/register" render={() => (user ? <Redirect to="/tabs/contacts" /> : <Register />)} />
        <Route path="/tabs" render={() => (user ? <Tabs /> : <Redirect to="/login" />)} />
        <Route exact path="/"><Redirect to="/tabs/contacts" /></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <NetworkProvider>
        <Routes />
      </NetworkProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
