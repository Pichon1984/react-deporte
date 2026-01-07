import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PagoMercadoPago = () => {
  const navigate = useNavigate();
  const { compraId } = useParams();

  useEffect(() => {
    async function initBrick() {
      try {
        // 1️⃣ Pedir preferencia al backend
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos/crear/${compraId}`, {
          method: "POST",
        });
        const data = await res.json();

        if (!data.ok || !data.id) {
          console.error("❌ Error creando preferencia:", data.error);
          return;
        }

        // 2️⃣ Inicializar MercadoPago
        const mp = new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
          locale: "es-AR",
        });

        // 3️⃣ Crear Brick
        mp.bricks().create("cardPayment", "card-payment-container", {
          initialization: {
            amount: data.amount,
            preferenceId: data.id,
          },
          customization: {
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
            },
          },
          callbacks: {
            onSubmit: async (cardFormData) => {
              try {
                const resPago = await fetch(`${import.meta.env.VITE_API_URL}/api/pagos/procesar`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    compraId,
                    amount: data.amount,
                    cardFormData,
                  }),
                });

                const pagoData = await resPago.json();
                console.log("Respuesta del backend:", pagoData);

                if (pagoData.ok && pagoData.compraId) {
                  navigate(`/checkout/success/${pagoData.compraId}`);
                } else {
                  alert("Error procesando el pago");
                }
              } catch (error) {
                console.error("❌ Error en onSubmit:", error);
                alert("Error procesando el pago");
              }
            },
            onReady: () => {
              console.log("✅ Brick listo para usar");
            },
            onError: (error) => {
              console.error("❌ Error en el Brick:", error);
            },
          },
        });
      } catch (err) {
        console.error("❌ Error inicializando Brick:", err);
      }
    }

    initBrick();

    // Cleanup para evitar duplicados
    return () => {
      const container = document.getElementById("card-payment-container");
      if (container) container.innerHTML = "";
    };
  }, [compraId, navigate]);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Pago con tarjeta</h2>
      <div id="card-payment-container"></div>
    </div>
  );
};

export default PagoMercadoPago;
