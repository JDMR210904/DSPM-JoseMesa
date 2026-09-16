import { useEffect, useState } from 'react';
import Login from './components/Login';
import Home from './pages/Home';
import { clearAuth, getAuth } from './utils/storage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [checkedSession, setCheckedSession] = useState(false);

  // Al recargar, recupera la sesión desde localStorage.
  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setUser(auth);
    }
    setCheckedSession(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
  };

  // Evita el "parpadeo" mostrando Login antes de revisar localStorage.
  if (!checkedSession) return null;

  return user ? (
    <Home user={user} onLogout={handleLogout} />
  ) : (
    <Login onLogin={setUser} />
  );
}

export default App;
