import { useState } from "react";
import emailjs from "@emailjs/browser";
import "../styles/ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Variables desde tu .env
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESET;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setMensaje(null);

    try {
      // 1. Llamada al backend para generar token
      const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email }),
      });

      const data = await res.json();

      if (!data.token) {
        setError(data.msg || "Error al generar token");
        return;
      }

      // 2. Armar el enlace de recuperación
      const resetLink = `http://localhost:3000/reset-password?token=${data.token}`;

      // 3. Enviar correo con EmailJS
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { to_email: email, reset_link: resetLink },
        PUBLIC_KEY
      );

      setMensaje("Correo de recuperación enviado correctamente");
    } catch (err) {
      setError("Error al enviar correo de recuperación");
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
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
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

