import { useState } from "react";
import { OrdersService } from "../services/orders.js";

export function CreateOrder() {
  const [status, setStatus] = useState("");

  async function handleCreate() {
    try {
      const order = {
        productId: "123",
        quantity: 2,
        userId: "456",
      };
      const result = await OrdersService.create(order);
      setStatus(`Orden creada con ID: ${result.id}`);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <div>
      <button onClick={handleCreate}>Crear Orden</button>
      {status && <p>{status}</p>}
    </div>
  );
}
