import { IonApp, setupIonicReact } from '@ionic/react';
import TaskManager from './pages/TaskManager';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

setupIonicReact();

function App() {
  return (
    <IonApp>
      <TaskManager />
    </IonApp>
  );
}

export default App;