import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import AccelerometerPage from './pages/AccelerometerPage';
import CameraPage from './pages/CameraPage';
import DevicePage from './pages/DevicePage';
import FilesystemPage from './pages/FilesystemPage';
import GeolocationPage from './pages/GeolocationPage';
import HapticsPage from './pages/HapticsPage';
import Home from './pages/Home';
import LocalNotificationsPage from './pages/LocalNotificationsPage';
import PushNotificationsPage from './pages/PushNotificationsPage';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home" component={Home} />
        <Route exact path="/geolocation" component={GeolocationPage} />
        <Route exact path="/camera" component={CameraPage} />
        <Route exact path="/accelerometer" component={AccelerometerPage} />
        <Route exact path="/device" component={DevicePage} />
        <Route exact path="/haptics" component={HapticsPage} />
        <Route exact path="/filesystem" component={FilesystemPage} />
        <Route exact path="/local-notifications" component={LocalNotificationsPage} />
        <Route exact path="/push-notifications" component={PushNotificationsPage} />
        <Route exact path="/"><Redirect to="/home" /></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
