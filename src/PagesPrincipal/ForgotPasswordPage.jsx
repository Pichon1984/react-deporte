import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { forgotPassword } from "../services/authService";
import "../styles/ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inicializar EmailJS con la public key
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);

    try {
      // 👉 Llamada al backend
      const resp = await forgotPassword(email);
      console.log("🔍 Respuesta backend forgotPassword:", resp);

      if (resp.ok && resp.data?.link) {
        // 👉 Usar el link armado en backend (con FRONTEND_URL)
        const result = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESET,
          {
            to_email: email,
            recovery_link: resp.data.link,
          }
        );

        console.log("📧 Resultado envío EmailJS:", result);
        setMensaje("Correo de recuperación enviado correctamente ✅");
      } else {
        setError(
          resp.data?.msg ||
            "No se pudo generar el enlace de recuperación. Revisa tu configuración."
        );
      }
    } catch (err) {
      console.error("❌ Error en ForgotPasswordPage:", err);
      setError("Error de conexión con el servidor. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="card shadow-sm p-4">
              <h2 className="text-center mb-4">Recuperar contraseña</h2>

              {mensaje && <div className="alert success">{mensaje}</div>}
              {error && <div className="alert error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
