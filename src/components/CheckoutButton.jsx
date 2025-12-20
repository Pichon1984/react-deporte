import { useState } from "react";
import { OrdersService } from "../services/orders.js";

export function CheckoutButton() {
  const [status, setStatus] = useState("");

  async function handleCheckout() {
    try {
      const payload = {
        envio: {
          nombre: "Sergio",
          email: "sergio@test.com",
          direccion: "Calle Falsa 123",
          localidad: "Famaillá",
          provincia: "Tucumán",
        },
        productos: [
          { nombre: "Pelota", precio: 100, cantidad: 1, costoEnvio: 50 },
          { nombre: "Camiseta", precio: 200, cantidad: 2, costoEnvio: 0 },
        ],
      };

      const result = await OrdersService.checkout(payload);
      setStatus(`Orden creada: ${result.ordenId}`);
      window.location.href = result.checkoutUrl; // redirige a MercadoPago
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <div>
      <button onClick={handleCheckout}>Ir al Checkout</button>
      {status && <p>{status}</p>}
    </div>
  );
}
