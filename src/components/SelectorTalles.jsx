import { Form } from "react-bootstrap";

const SelectorTalles = ({ talles = [], talleSeleccionado, onChange }) => {
  if (!talles.length) return null;

  return (
    <div className="mt-3">
      <h5>Seleccioná un talle</h5>
      {talles.map((talle, idx) => (
        <Form.Check
          key={idx}
          type="radio"
          name="talle"
          label={`${talle.nombre} (Unidades: ${talle.stock})`}
          value={talle.nombre}
          checked={talleSeleccionado?.nombre === talle.nombre}
          onChange={() => onChange(talle)} // 👈 guarda el objeto completo (nombre + stock)
          disabled={talle.stock <= 0} // 👈 deshabilita si no hay stock
        />
      ))}
    </div>
  );
};

export default SelectorTalles;

