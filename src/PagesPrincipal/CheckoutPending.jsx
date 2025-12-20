import { useParams } from "react-router-dom";

export function CheckoutPending() {
  const { id } = useParams();

  return (
    <div>
      <h2>⏳ Pago pendiente</h2>
      <p>Orden ID: {id}</p>
      <p>Tu pago está en proceso. Te notificaremos cuando se confirme.</p>
    </div>
  );
}
