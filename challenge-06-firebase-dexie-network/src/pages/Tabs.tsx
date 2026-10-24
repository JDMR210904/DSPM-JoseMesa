import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { logOutOutline, nutritionOutline, peopleOutline, checkboxOutline } from 'ionicons/icons';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Contacts from './Contacts';
import Fruits from './Fruits';
import Tasks from './Tasks';

const Tabs: React.FC = () => {
  const { logout } = useAuthContext();
  const history = useHistory();

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/contacts" component={Contacts} />
        <Route exact path="/tabs/tasks" component={Tasks} />
        <Route exact path="/tabs/fruits" component={Fruits} />
        <Route exact path="/tabs"><Redirect to="/tabs/contacts" /></Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="contacts" href="/tabs/contacts">
          <IonIcon icon={peopleOutline} /><IonLabel>Contactos</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tasks" href="/tabs/tasks">
          <IonIcon icon={checkboxOutline} /><IonLabel>Tareas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="fruits" href="/tabs/fruits">
          <IonIcon icon={nutritionOutline} /><IonLabel>Frutas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="logout" onClick={handleLogout}>
          <IonIcon icon={logOutOutline} /><IonLabel>Salir</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
