import React from "react";
import { useParams } from "react-router-dom";

function CheckoutResult({ tipo }) {
  const { id } = useParams();

  return (
    <div>
      {tipo === "success" && <h2>✅ Pago aprobado</h2>}
      {tipo === "failure" && <h2>❌ Pago rechazado</h2>}
      {tipo === "pending" && <h2>⏳ Pago pendiente</h2>}

      <p>Orden ID: {id}</p>
      <a href="/">Volver a la tienda</a>
    </div>
  );
}

export default CheckoutResult;
