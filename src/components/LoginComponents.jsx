import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/img/logo.png";

const LoginComponent = () => {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logIn } = useAuth();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    // 🔹 Login request
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password: contraseña }),
      credentials: "include", // siempre incluir cookies
    });

    const data = await resp.json();

    if (!resp.ok) {
      return setError(data.msg || "Error en login");
    }

    // 🔹 Guardar token en localStorage (solo en desarrollo)
    if (import.meta.env.MODE !== "production" && data.token) {
      localStorage.setItem("token", data.token);
    }

    // 🔹 Obtener usuario con /check
    const checkResp = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/check`, {
      credentials: "include", // en producción viaja la cookie
      headers: import.meta.env.MODE !== "production"
        ? { "Content-Type": "application/json", "x-token": localStorage.getItem("token") || "" }
        : {},
    });

    const checkData = await checkResp.json();

    if (!checkResp.ok || !checkData.usuario) {
      return setError("No se pudo validar la sesión");
    }

    const usuario = checkData.usuario;
    const token = data.token || null;

    // ✅ Actualizar contexto de autenticación
    logIn(usuario, token);

    // 🔹 Redirección después de login
    const redirect = localStorage.getItem("redirectAfterLogin");
    if (redirect) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirect);
      return;
    }

    // 🔹 Redirección según rol
    if (usuario.rol === "ADMIN") {
      navigate("/admin");
    } else if (usuario.rol === "CLIENTE") {
      navigate("/cliente");
    } else {
      navigate("/inicio");
    }
  } catch (error) {
    console.error(error);
    setError(error.message || "Error en el servidor o CORS bloqueado");
  }
};


  return (
    <div className="container-fluid py-5" id="contenedoriniciosesion">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
          <img src={logo} alt="Logo" style={{ width: "300px", height: "auto" }} />
        </div>

        <div className="col-md-6 col-lg-4 px-4">
          <h1 className="mb-4 text-center">Iniciar sesión</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo electrónico:</label>
              <input
                type="email"
                className="form-control"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contraseña" className="form-label">Contraseña:</label>
              <input
                type="password"
                className="form-control"
                id="contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3 text-end">
              <Link to="/forgot-password" className="text-decoration-none">
                Olvidé mi contraseña
              </Link>
            </div>
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-danger">Iniciar sesión</button>
            </div>
          </form>

          <div className="mb-3">
            <Link to="/Registro" className="text-decoration-none">
              Registrarme
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;


