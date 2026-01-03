import { useParams } from "react-router-dom";

export function CheckoutPending() {
  const { id } = useParams();

  return (
    <div className="checkout-pending">
      <h2>⏳ Pago pendiente</h2>
      <p><strong>Orden ID:</strong> {id}</p>
      <p>
        Tu pago está en proceso. Te notificaremos cuando se confirme. 
        Mientras tanto, podés revisar el estado de tu orden en tu cuenta.
      </p>
    </div>
  );
}
