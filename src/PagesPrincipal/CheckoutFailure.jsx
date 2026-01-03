import { useParams } from "react-router-dom";

export function CheckoutFailure() {
  const { id } = useParams();

  return (
    <div className="checkout-failure">
      <h2>❌ Pago rechazado</h2>
      <p><strong>Orden ID:</strong> {id}</p>
      <p>
        Tu pago no pudo completarse. Intenta nuevamente o prueba con otro medio
        de pago.
      </p>
    </div>
  );
}
