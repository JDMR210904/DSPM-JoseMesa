import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { podium, rocket, trophy } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import Missions from './Missions';
import Ranking from './Ranking';
import Results from './Results';

const Tabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/tabs/missions" component={Missions} />
      <Route exact path="/tabs/ranking" component={Ranking} />
      <Route exact path="/tabs/results" component={Results} />
      <Route exact path="/tabs"><Redirect to="/tabs/missions" /></Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="missions" href="/tabs/missions">
        <IonIcon icon={rocket} /><IonLabel>Misiones</IonLabel>
      </IonTabButton>
      <IonTabButton tab="ranking" href="/tabs/ranking">
        <IonIcon icon={podium} /><IonLabel>Ranking</IonLabel>
      </IonTabButton>
      <IonTabButton tab="results" href="/tabs/results">
        <IonIcon icon={trophy} /><IonLabel>Resultados</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default Tabs;
