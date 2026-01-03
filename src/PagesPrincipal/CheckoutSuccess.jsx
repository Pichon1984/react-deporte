import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ComprasService } from "../services/compras.js";

export function CheckoutSuccess() {
  const { id } = useParams();
  const [compra, setCompra] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ID recibido desde la URL:", id);

    ComprasService.getById(id)
      .then((data) => {
        console.log("Respuesta del backend:", data);
        setCompra(data);
      })
      .catch((err) => {
        console.error("❌ Error al traer la compra:", err);
        setError(err.message || "No se pudo cargar la compra");
      });
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!compra) return <p>Cargando compra...</p>;

  const LIMITE_ENVIO_GRATIS = 200000;
  const total = compra.total ?? 0;
  const costoEnvio = compra.costoEnvio ?? 0;
  const totalFinal = compra.totalFinal ?? total + costoEnvio;
  const faltante = Math.max(LIMITE_ENVIO_GRATIS - total, 0);

  // 🔑 Función segura para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const fecha = new Date(dateString);
    return isNaN(fecha.getTime())
      ? "Sin fecha"
      : fecha.toLocaleString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  // 📌 Mensaje dinámico según estado
  const renderEstado = () => {
    switch (compra.estado) {
      case "pagada":
        return <h2 style={{ color: "green" }}>✅ Pago aprobado</h2>;
      case "pendiente":
        return <h2 style={{ color: "orange" }}>⏳ Pago pendiente</h2>;
      case "fallida":
        return <h2 style={{ color: "red" }}>❌ Pago rechazado</h2>;
      case "reembolsada":
        return <h2 style={{ color: "blue" }}>💸 Pago reembolsado</h2>;
      default:
        return <h2>ℹ️ Estado desconocido</h2>;
    }
  };

  return (
    <div className="checkout-success">
      {renderEstado()}
      <p><strong>Compra ID:</strong> {compra._id}</p>
      <p><strong>Total productos:</strong> ${total.toLocaleString("es-AR")}</p>
      <p><strong>Costo de envío:</strong> ${costoEnvio.toLocaleString("es-AR")}</p>
      <p><strong>Total final:</strong> ${totalFinal.toLocaleString("es-AR")}</p>
      <p><strong>Estado:</strong> {compra.estado}</p>

      {costoEnvio > 0 && (
        <p style={{ color: "green" }}>
          Te faltaron ${faltante.toLocaleString("es-AR")} para envío gratis 🚚
        </p>
      )}
      {costoEnvio === 0 && (
        <p style={{ color: "blue" }}>¡Tenés envío gratis! 🎉</p>
      )}

      {/* 📅 Fechas seguras */}
      <p><strong>Fecha de creación:</strong> {formatDate(compra.createdAt)}</p>
      <p><strong>Fecha de envío:</strong> {formatDate(compra.fechaEnvio)}</p>
      <p><strong>Fecha de entrega:</strong> {formatDate(compra.fechaEntrega)}</p>
    </div>
  );
}
