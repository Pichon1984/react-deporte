import { useState } from "react";
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
      // Llamada al backend (Vercel) para generar token y enviar correo
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error al enviar correo de recuperación");
      } else {
        setMensaje(data.msg || "Correo de recuperación enviado correctamente");
      }
    } catch (err) {
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

