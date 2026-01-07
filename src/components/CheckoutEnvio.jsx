import { useState } from "react";
import { calcularEnvio } from "../services/api.js";

export function CheckoutEnvio({ compraId }) {
  const [resultado, setResultado] = useState(null);

  const handleCalcularEnvio = async () => {
    const token = localStorage.getItem("token");
    const payload = { compraId, direccion: { ... } };
    const res = await calcularEnvio(token, payload);
    setResultado(res);
  };

  return (
    <div>
      <button onClick={handleCalcularEnvio}>Calcular envío 🚚</button>
      {resultado && <p>Costo: ${resultado.costo}</p>}
    </div>
  );
}
