import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { usuario, cargando } = useContext(AuthContext);

  // Mientras se valida la sesión, mostramos un loader
  if (cargando) return <div>Cargando sesión...</div>;

  // Si no hay usuario → redirige al login
  if (!usuario) return <Navigate to="/Cuenta" replace />;

  // Si hay roles definidos y el usuario no tiene permiso → redirige al inicio
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/inicio" replace />;
  }

  // Si todo está correcto → renderiza la ruta protegida
  return children;
};

export default ProtectedRoute;






