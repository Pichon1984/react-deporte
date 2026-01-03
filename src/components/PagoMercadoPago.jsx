import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PagoMercadoPago = ({ preferenceId, amount }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!preferenceId || !amount) return;

    const mp = new window.MercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY, {
      locale: "es-AR",
    });

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
            // Enviamos los datos del pago al backend para procesar
            const res = await fetch("http://localhost:3000/api/pagos/procesar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                preferenceId,
                amount,
                cardFormData,
              }),
            });

            const data = await res.json();
            console.log("Respuesta del backend:", data);

            if (data.ok && data.compraId) {
              // Redirigimos al CheckoutSuccess con el ID real de la compra
              navigate(`/checkout-success/${data.compraId}`);
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
