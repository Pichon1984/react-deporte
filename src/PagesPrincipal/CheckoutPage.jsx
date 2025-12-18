import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CheckoutPage({ tipo }) {
  const { id } = useParams(); // solo existe si es checkout por compra
  const [compra, setCompra] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [envio, setEnvio] = useState(null);
  const [error, setError] = useState(null);

  async function iniciarCheckout() {
    try {
     const token = localStorage.getItem("token");
const headers = { "x-token": token }; // 👈 nada de Bearer

const res = await fetch(`/api/compras/${id}`, { headers });



      if (tipo === "compra") {
        // flujo por compra específica
        const res = await fetch(`/api/compras/${id}`, { headers }); // 👈 ahora coincide con router
        if (!res.ok) throw new Error("Error obteniendo compra");
        const data = await res.json();
        setCompra(data);
      } else {
        // flujo por carrito completo
        const carritoGuardado =
          JSON.parse(localStorage.getItem("carrito")) || [];
        setCarrito(carritoGuardado);
      }

      // calcular envío (ejemplo con Andreani)
      const envioRes = await fetch(
        `/api/envios/andreani?origen=1000&destino=4000&peso=1`,
        { headers }
      );
      if (!envioRes.ok) throw new Error("Error obteniendo envío");
      const envioJson = await envioRes.json();
      setEnvio(envioJson);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    iniciarCheckout();
  }, [id, tipo]);

  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div>
      <h2>Checkout</h2>

      {/* Flujo por compra específica */}
      {tipo === "compra" && compra && (
        <>
          <h3>Compra</h3>
          {Array.isArray(compra.productos) &&
            compra.productos.map((item, idx) => (
              <div key={idx}>
                {item.nombre} - ${item.precio} x {item.cantidad}
              </div>
            ))}
          <p>Total: ${compra.total}</p>
        </>
      )}

      {/* Flujo por carrito completo */}
      {tipo === "carrito" && carrito.length > 0 && (
        <>
          <h3>Carrito</h3>
          {carrito.map((item, idx) => (
            <div key={idx}>
              {item.nombre} - ${item.precio} x {item.cantidad}
            </div>
          ))}
          <p>
            Total: $
            {carrito.reduce(
              (acc, item) => acc + item.precio * item.cantidad,
              0
            )}
          </p>
        </>
      )}

      {/* Envío */}
      <h3>Envío</h3>
      {envio ? (
        <p>
          Costo: ${envio.costo} | Tiempo: {envio.tiempo} días
        </p>
      ) : (
        <p>Calculando envío...</p>
      )}
    </div>
  );
}


