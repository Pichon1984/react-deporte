import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { usuario, cargando } = useContext(AuthContext);
  const location = useLocation();

  if (cargando) return <div>Cargando sesión...</div>;

  if (!usuario) {
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(usuario.rol)) {
   
    return <Navigate to="/inicio" replace />;
  }

  return children;
};

export default ProtectedRoute;









