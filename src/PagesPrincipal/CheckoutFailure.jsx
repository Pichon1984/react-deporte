import { useParams } from "react-router-dom";

export function CheckoutFailure() {
  const { id } = useParams();

  return (
    <div>
      <h2>❌ Pago rechazado</h2>
      <p>Orden ID: {id}</p>
      <p>Tu pago no pudo completarse. Intenta nuevamente.</p>
    </div>
  );
}
