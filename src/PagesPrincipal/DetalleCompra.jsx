import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetalleCompra = () => {
  const { compraId } = useParams();
  const [compra, setCompra] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`http://localhost:3000/api/compras/${compraId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-token": token,
          },
        });

        const data = await resp.json();
        if (resp.ok && data.ok) {
          setCompra(data.compra);
        } else {
          setCompra(null);
        }
      } catch (error) {
        console.error("Error cargando compra:", error);
        setCompra(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompra();
  }, [compraId]);

  const iniciarPago = async () => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`http://localhost:3000/api/pagos/crear/${compraId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-token": token,
        },
      });

      const data = await resp.json();
      if (resp.ok && data.init_point) {
        window.location.href = data.init_point; 
      } else {
        alert("No se pudo iniciar el pago");
      }
    } catch (error) {
      console.error("Error iniciando pago:", error);
      alert("Error iniciando pago");
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando compra...</p>;
  if (!compra) return <p className="text-center mt-5">Compra no encontrada.</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">🧾 Detalle de compra #{compra._id}</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <p><strong>Fecha:</strong> {new Date(compra.createdAt).toLocaleDateString()}</p>
          <p><strong>Subtotal productos:</strong> ${compra.total}</p>
          <p><strong>Precio envío:</strong> ${compra.costoEnvio}</p>
          <p><strong>Total final:</strong> ${compra.totalFinal}</p>

          <p>
            <strong>Estado pago:</strong>{" "}
            <span
              className={`badge ${
                compra.estado === "pagada"
                  ? "bg-success"
                  : compra.estado === "cancelada"
                  ? "bg-danger"
                  : "bg-warning text-dark"
              }`}
            >
              {compra.estado}
            </span>
          </p>
          <p><strong>Estado envío:</strong> {compra.estadoEnvio}</p>

          {compra.trackingNumber && (
            <p>
              <strong>Tracking:</strong> {compra.trackingNumber} ({compra.courier})
            </p>
          )}
          {compra.fechaEnvio && (
            <p><strong>Fecha de envío:</strong> {new Date(compra.fechaEnvio).toLocaleDateString()}</p>
          )}
          {compra.fechaEntrega && (
            <p><strong>Fecha de entrega:</strong> {new Date(compra.fechaEntrega).toLocaleDateString()}</p>
          )}

    
          {compra.estado === "pendiente" && (
            <button className="btn btn-primary mb-3" onClick={iniciarPago}>
              💳 Pagar ahora
            </button>
          )}

          <h5>Productos</h5>
          <ul className="list-group list-group-flush mb-3">
            {compra.productos.map((item, idx) => (
              <li key={idx} className="list-group-item py-1 px-2">
                {item.nombre} — {item.cantidad} x ${item.precio}
                {item.talle && (
                  <span className="ms-2 text-muted">Talle: {item.talle}</span>
                )}
                <span className="ms-2 fw-bold">Subtotal: ${item.subtotal}</span>
              </li>
            ))}
          </ul>

         
          {compra.envioEventos && compra.envioEventos.length > 0 && (
            <>
              <h5>📦 Historial de envío</h5>
              <ul className="list-group list-group-flush">
                {compra.envioEventos.map((evento, idx) => (
                  <li key={idx} className="list-group-item py-1 px-2">
                    <strong>{evento.status}</strong> — {new Date(evento.fecha).toLocaleString()}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleCompra;
