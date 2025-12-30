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
          label={talle}
          value={talle}
          checked={talleSeleccionado === talle}
          onChange={(e) => onChange(e.target.value)}
        />
      ))}
    </div>
  );
};

export default SelectorTalles;
