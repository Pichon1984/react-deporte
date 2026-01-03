import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { compraId } = useParams();
  const [preferenceId, setPreferenceId] = useState(null);
  const [montoTotal, setMontoTotal] = useState(0);
  const navigate = useNavigate();

  // 1️⃣ Crear preferencia en backend
  useEffect(() => {
    const crearPreferencia = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/api/pagos/crear/${compraId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-token": token,
          },
        });
        const data = await res.json();
        if (data.ok) {
          setPreferenceId(data.id);        // ID de la preferencia
          setMontoTotal(data.amount || 0); // totalFinal que devuelve tu backend
        }
      } catch (error) {
        console.error("❌ Error creando preferencia:", error);
      }
    };
    crearPreferencia();
  }, [compraId]);

  // 2️⃣ Renderizar Brick
  useEffect(() => {
    if (!preferenceId || !montoTotal) return;

    const mp = new window.MercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY, {
      locale: "es-AR",
    });

    mp.bricks().create("cardPayment", "card-payment-container", {
      initialization: {
        amount: montoTotal,
        preferenceId: preferenceId,
      },
      callbacks: {
        onSubmit: async (cardFormData) => {
          try {
            const res = await fetch("http://localhost:3000/api/pagos/procesar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ compraId, amount: montoTotal, cardFormData }),
            });
            const data = await res.json();
            if (data.ok && data.compraId) {
              navigate(`/checkout/success/${data.compraId}`);
            } else {
              alert("❌ Error procesando pago");
            }
          } catch (error) {
            console.error("❌ Error en onSubmit:", error);
          }
        },
        onError: (error) => {
          console.error("❌ Error en Brick:", error);
        },
      },
    });
  }, [preferenceId, montoTotal, navigate]);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Finalizar compra</h2>
      <div id="card-payment-container"></div>
    </div>
  );
}
