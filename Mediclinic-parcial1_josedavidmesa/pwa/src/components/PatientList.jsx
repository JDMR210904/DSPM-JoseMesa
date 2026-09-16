import PatientItem from './PatientItem';

// Componente hijo "tonto": solo recibe la lista ya filtrada por el padre
// (Home.jsx) y la muestra. No conoce el estado del buscador.
function PatientList({ patients, onDelete }) {
  if (patients.length === 0) {
    return <p className="empty">No hay pacientes para mostrar.</p>;
  }

  return (
    <ul className="patient-list">
      {patients.map((p) => (
        <PatientItem key={p.id} patient={p} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default PatientList;
