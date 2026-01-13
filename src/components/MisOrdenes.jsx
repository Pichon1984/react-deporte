import React, { useEffect, useState } from "react";
import { fetchConToken } from "../helpers/fetch";

export const MisOrdenesPage = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
       
        const body = await fetchConToken("/api/orders/misordenes");

        if (body.ok) {
          setOrdenes(body.ordenes);
        } else {
          setError(body.msg || "Error cargando órdenes");
          console.error(body.msg);
        }
      } catch (error) {
        setError(error.message);
        console.error("Error cargando órdenes", error);
      }
    };

    cargarOrdenes();
  }, []);

  return (
    <div>
      <h2>Mis Órdenes</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {ordenes.length === 0 ? (
        <p>No tienes órdenes registradas.</p>
      ) : (
        <ul>
          {ordenes.map((orden) => (
            <li key={orden._id}>
              <strong>Orden #{orden._id}</strong> - Estado: {orden.estado}
              <ul>
                {orden.productos.map((p) => (
                  <li key={p._id}>
                    {p.producto?.nombre} x {p.cantidad} → ${p.producto?.precio}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
