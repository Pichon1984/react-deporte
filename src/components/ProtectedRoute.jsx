import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { usuario, cargando } = useContext(AuthContext);
  const location = useLocation();

  if (cargando) return <div>Cargando sesión...</div>;

  if (!usuario) {
    // 🔹 Redirige al login y guarda la ruta original
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    // 🔹 Usuario logueado pero sin rol adecuado → lo mandamos a inicio
    return <Navigate to="/inicio" replace />;
  }

  return children;
};

export default ProtectedRoute;









