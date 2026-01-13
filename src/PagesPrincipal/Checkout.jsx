import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { initMercadoPago } from "@mercadopago/sdk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Checkout() {
  const { compraId } = useParams();
  const [preferenceId, setPreferenceId] = useState(null);
  const [montoTotal, setMontoTotal] = useState(0);
  const navigate = useNavigate();
  const brickControllerRef = useRef(null);


  useEffect(() => {
    initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-AR" });
  }, []);

  
  useEffect(() => {
    if (!compraId) return;

    const crearPreferencia = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/pagos/crear/${compraId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-token": token,
          },
        });
        const data = await res.json();
        if (data.ok) {
          setPreferenceId(data.preferenceId); 
          setMontoTotal(Number(parseFloat(data.amount).toFixed(2))); 
        } else {
          console.error("❌ Error creando preferencia:", data.error);
        }
      } catch (error) {
        console.error("❌ Error creando preferencia:", error);
      }
    };

    crearPreferencia();
  }, [compraId]);

  
  useEffect(() => {
    if (!preferenceId || !montoTotal) return;

    const mp = new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
      locale: "es-AR",
    });

    const bricksBuilder = mp.bricks();

    bricksBuilder
      .create("cardPayment", "card-payment-container", {
        initialization: {
          amount: montoTotal, 
          preferenceId,
        },
        callbacks: {
          onSubmit: async (cardFormData) => {
            try {
              const res = await fetch(`${API_URL}/api/pagos/procesar`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-token": localStorage.getItem("token"),
                },
                body: JSON.stringify({
                  compraId,
                  amount: montoTotal,
                  cardFormData,
                }),
              });
              const data = await res.json();
              if (data.ok && data.compraId) {
                navigate(`/checkout/success/${data.compraId}`);
              } else {
                alert("❌ Error procesando pago");
              }
            } catch (error) {
              console.error("❌ Error en onSubmit:", error);
              alert(`Error en onSubmit: ${error.message || JSON.stringify(error)}`);
            }
          },
          onReady: () => {
            console.log("✅ Brick listo para usar");
          },
          onError: (error) => {
            console.error("❌ Error en Brick:", error);
            alert(`Error en Brick: ${error.message || JSON.stringify(error)}`);
          },
        },
      })
      .then((controller) => {
        brickControllerRef.current = controller;
      });

    
    return () => {
      if (brickControllerRef.current && typeof brickControllerRef.current.unmount === "function") {
        brickControllerRef.current.unmount();
      }
    };
  }, [preferenceId, montoTotal]); 

  return (
    <div className="container py-5">
      <h2 className="mb-4">Finalizar compra</h2>
      <div id="card-payment-container"></div>
    </div>
  );
}
