import { useState } from 'react';
import { setAuth } from '../utils/storage';

// Usuarios fijos proporcionados por el desarrollador (requisito del parcial)
const USERS = [{ username: 'admin', password: 'clinica123' }];

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (found) {
      const user = { username: found.username };
      setAuth(user);
      setError('');
      onLogin(user);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-page">
      <h1>MediClinic</h1>
      <p className="subtitle">Administración de pacientes</p>

      <form onSubmit={handleSubmit}>
        <label>
          Usuario
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button type="submit">Ingresar</button>

        {error && <p className="error">{error}</p>}
      </form>

      <p className="hint">Usuario de prueba: admin / clinica123</p>
    </div>
  );
}

export default Login;
