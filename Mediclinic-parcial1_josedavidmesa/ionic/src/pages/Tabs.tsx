import { Redirect, Route } from 'react-router-dom';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from '@ionic/react';
import { medicalOutline, peopleOutline, personOutline } from 'ionicons/icons';
import Visitas from './Visitas';
import VisitDetail from './VisitDetail';
import Pacientes from './Pacientes';
import Perfil from './Perfil';

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/visitas" component={Visitas} />
        <Route exact path="/tabs/visitas/:id" component={VisitDetail} />
        <Route exact path="/tabs/pacientes" component={Pacientes} />
        <Route exact path="/tabs/perfil" component={Perfil} />
        <Route exact path="/tabs">
          <Redirect to="/tabs/visitas" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="visitas" href="/tabs/visitas">
          <IonIcon icon={medicalOutline} />
          <IonLabel>Visitas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="pacientes" href="/tabs/pacientes">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Pacientes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/tabs/perfil">
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
