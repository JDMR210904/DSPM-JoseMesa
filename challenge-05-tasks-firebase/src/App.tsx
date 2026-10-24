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
import { TasksProvider } from './context/TasksContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskDetail from './pages/TaskDetail';
import TaskForm from './pages/TaskForm';
import TaskList from './pages/TaskList';

setupIonicReact();

// Ruta que solo se muestra con sesión iniciada
const PrivateRoute: React.FC<{ path: string; exact?: boolean; component: React.ComponentType }> = ({ component: C, ...rest }) => {
  const { user } = useAuthContext();
  return <Route {...rest} render={() => (user ? <C /> : <Redirect to="/login" />)} />;
};

// Rutas de login/registro: si ya hay sesión, van directo a la lista
const PublicRoute: React.FC<{ path: string; component: React.ComponentType }> = ({ component: C, ...rest }) => {
  const { user } = useAuthContext();
  return <Route {...rest} exact render={() => (user ? <Redirect to="/tasks" /> : <C />)} />;
};

const Routes: React.FC = () => {
  const { loading } = useAuthContext();

  if (loading) {
    return <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}><IonSpinner /></div>;
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/register" component={Register} />
        <PrivateRoute path="/tasks" exact component={TaskList} />
        {/* Rutas distintas entre sí para que Ionic nunca confunda "new" con un :id */}
        <PrivateRoute path="/task-new" exact component={TaskForm} />
        <PrivateRoute path="/task-edit/:id" exact component={TaskForm} />
        <PrivateRoute path="/task/:id" exact component={TaskDetail} />
        <Route exact path="/"><Redirect to="/tasks" /></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <TasksProvider>
        <Routes />
      </TasksProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
