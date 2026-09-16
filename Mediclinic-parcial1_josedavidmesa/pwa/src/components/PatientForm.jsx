import { useState } from 'react';

function PatientForm({ onAdd }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cc, setCc] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }
    if (!/^\d{6,10}$/.test(cc.trim())) {
      newErrors.cc = 'La CC debe tener solo números (6 a 10 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAdd({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      cc: cc.trim(),
      telefono: telefono.trim(),
    });

    setNombre('');
    setApellido('');
    setCc('');
    setTelefono('');
    setErrors({});
  };

  return (
    <form className="patient-form" onSubmit={handleSubmit}>
      <h2>Agregar paciente</h2>

      <label>
        Nombre
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {errors.nombre && <span className="error">{errors.nombre}</span>}
      </label>

      <label>
        Apellido
        <input value={apellido} onChange={(e) => setApellido(e.target.value)} />
        {errors.apellido && <span className="error">{errors.apellido}</span>}
      </label>

      <label>
        CC
        <input value={cc} onChange={(e) => setCc(e.target.value)} />
        {errors.cc && <span className="error">{errors.cc}</span>}
      </label>

      <label>
        Teléfono
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </label>

      <button type="submit">Agregar paciente</button>
    </form>
  );
}

export default PatientForm;
