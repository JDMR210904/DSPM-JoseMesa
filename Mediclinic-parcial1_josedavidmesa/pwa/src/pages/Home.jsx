import { useEffect, useState } from 'react';
import PatientForm from '../components/PatientForm';
import PatientList from '../components/PatientList';
import SearchBar from '../components/SearchBar';
import { getPatients, savePatients } from '../utils/storage';

function Home({ user, onLogout }) {
  const [patients, setPatients] = useState([]);
  // Estado del buscador vive aquí (componente padre), como pide el parcial.
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPatients(getPatients());
  }, []);

  const addPatient = (patient) => {
    const updated = [...patients, { id: Date.now(), ...patient }];
    setPatients(updated);
    savePatients(updated);
  };

  const deletePatient = (id) => {
    const updated = patients.filter((p) => p.id !== id);
    setPatients(updated);
    savePatients(updated);
  };

  // Lista filtrada calculada en el padre y enviada al hijo (PatientList).
  const filteredPatients = patients.filter((p) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      p.nombre.toLowerCase().includes(term) ||
      p.apellido.toLowerCase().includes(term) ||
      p.cc.toLowerCase().includes(term)
    );
  });

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>MediClinic</h1>
        <div className="user-info">
          <span>Hola, {user.username}</span>
          <button onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      <PatientForm onAdd={addPatient} />
      <SearchBar value={search} onChange={setSearch} />
      <PatientList patients={filteredPatients} onDelete={deletePatient} />
    </div>
  );
}

export default Home;
