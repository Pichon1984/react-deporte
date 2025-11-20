import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoutesAdmin({ children, auth }) {
  const { usuario } = useContext(AuthContext);

  if (!usuario || !auth) {
    return <Navigate to="/inicio" />;
  }

  return children;
}

export default ProtectedRoutesAdmin;

