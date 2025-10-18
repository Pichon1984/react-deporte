import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoutesAdmin({ children, auth }) {
  return auth ? children : <Navigate to="/home" replace />;
}

export default ProtectedRoutesAdmin;

