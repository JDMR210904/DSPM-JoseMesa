function PatientItem({ patient, onDelete }) {
  return (
    <li className="patient-item">
      <div>
        <strong>
          {patient.nombre} {patient.apellido}
        </strong>
        <p>CC: {patient.cc}</p>
        <p>Tel: {patient.telefono || '—'}</p>
      </div>
      <button className="danger" onClick={() => onDelete(patient.id)}>
        Eliminar
      </button>
    </li>
  );
}

export default PatientItem;
