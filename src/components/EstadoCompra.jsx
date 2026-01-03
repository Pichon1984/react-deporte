import { useEffect, useState } from "react";

function EstadoCompra({ compraId }) {
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const fetchCompra = async () => {
      const res = await fetch(`/compras/${compraId}`, {
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
      });
      const data = await res.json();
      setCompra(data.compra);
    };
    fetchCompra();
  }, [compraId]);

  if (!compra) return <p>Cargando...</p>;

  return (
    <div>
      <h3>Estado de la compra</h3>
      <p>Estado: {compra.estado}</p>
      <p>Estado de envío: {compra.estadoEnvio}</p>
      <p>Total: ${compra.totalFinal}</p>
    </div>
  );
}

export default EstadoCompra;
