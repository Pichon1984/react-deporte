import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PagoMercadoPago = ({ preferenceId, amount }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!preferenceId || !amount) return;

    const mp = new window.MercadoPago(
      process.env.REACT_APP_MP_PUBLIC_KEY, // o import.meta.env.VITE_MP_PUBLIC_KEY si usás Vite
      { locale: "es-AR" }
    );

    mp.bricks().create("cardPayment", "card-payment-container", {
      initialization: {
        amount: amount,
        preferenceId: preferenceId,
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
            // Usar variable de entorno para el backend
            const res = await fetch(
              `${process.env.REACT_APP_API_URL}/pagos/procesar`, // 👈 configurable
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  preferenceId,
                  amount,
                  cardFormData,
                }),
              }
            );

            const data = await res.json();
            console.log("Respuesta del backend:", data);

            if (data.ok && data.compraId) {
              // Redirigir a la ruta correcta
              navigate(`/checkout/success/${data.compraId}`);
            } else {
              alert("Error procesando el pago");
            }
          } catch (error) {
            console.error("Error en onSubmit:", error);
            alert("Error procesando el pago");
          }
        },
        onReady: () => {
          console.log("Brick listo para usar");
        },
        onError: (error) => {
          console.error("Error en el Brick:", error);
        },
      },
    });
  }, [preferenceId, amount, navigate]);

  return <div id="card-payment-container"></div>;
};

export default PagoMercadoPago;
