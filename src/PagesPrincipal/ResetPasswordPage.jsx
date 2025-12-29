import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import "../styles/ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token inválido o faltante en la URL.");
    }
  }, [token]);

  // 👉 Reglas de validación de contraseña
  const reglasPassword = [
    { test: (p) => p.length >= 8, msg: "Mínimo 8 caracteres" },
    { test: (p) => /[A-Z]/.test(p), msg: "Al menos una mayúscula" },
    { test: (p) => /\d/.test(p), msg: "Al menos un número" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);

    // Validar reglas
    const cumpleTodas = reglasPassword.every((r) => r.test(newPassword));
    if (!cumpleTodas) {
      setError("La contraseña no cumple las reglas de seguridad.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const resp = await resetPassword(token, newPassword);

      if (resp?.msg) {
        setMensaje(resp.msg);

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate("/Cuenta"); // 👈 asegúrate que exista esta ruta en tu App.jsx
        }, 2000);
      } else {
        setError("No se pudo actualizar la contraseña.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
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
              <h2 className="text-center mb-4">Restablecer contraseña</h2>

              {mensaje && <div className="alert success">{mensaje}</div>}
              {error && <div className="alert error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nueva contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <ul className="mt-2 list-unstyled">
                    {reglasPassword.map((r, i) => (
                      <li key={i} style={{ color: r.test(newPassword) ? "green" : "red" }}>
                        {r.test(newPassword) ? "✔" : "✘"} {r.msg}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirmar contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || !token}
                >
                  {loading ? "Actualizando..." : "Actualizar contraseña"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
