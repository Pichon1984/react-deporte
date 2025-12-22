import { useState } from "react";
import emailjs from "@emailjs/browser";
import { forgotPassword } from "../services/authService"; // 👈 usamos el servicio centralizado
import "../styles/ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setMensaje(null);

    try {
      // 1. Llamada al backend (Vercel) para generar token
      const resp = await forgotPassword(email);

      if (!resp || !resp.token) {
        setError(resp?.msg || "Error al generar token de recuperación");
      } else {
        const resetToken = resp.token;

        // 2. Enviar correo con EmailJS
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESET,
          {
            to_email: email,
            reset_link: `https://react-deporte.netlify.app/reset-password?token=${resetToken}`,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        setMensaje("Correo de recuperación enviado correctamente ✅");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
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

