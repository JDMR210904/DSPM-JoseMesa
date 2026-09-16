// El estado del buscador vive en el componente padre (Home.jsx).
// Este componente solo recibe el valor y notifica los cambios.
function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o CC..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
