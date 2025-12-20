import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OrdersService } from "../services/orders.js";

export function CheckoutSuccess() {
  const { id } = useParams(); // viene de la URL /checkout/success/:id
  const [orden, setOrden] = useState(null);

  useEffect(() => {
    OrdersService.listMine()
      .then((ordenes) => {
        const encontrada = ordenes.find((o) => o._id === id);
        setOrden(encontrada);
      })
      .catch(console.error);
  }, [id]);

  if (!orden) return <p>Cargando orden...</p>;

  return (
    <div>
      <h2>✅ Pago aprobado</h2>
      <p>Orden ID: {orden._id}</p>
      <p>Total: ${orden.total}</p>
      <p>Estado: {orden.estado}</p>
    </div>
  );
}


