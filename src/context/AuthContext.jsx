import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const almacenado = localStorage.getItem('usuario');
    if (almacenado) {
      setUsuario(JSON.parse(almacenado));
    }
  }, []);

  const logIn = (datos) => {
  localStorage.setItem('usuario', JSON.stringify(datos));
  setUsuario(datos);
};

const logOut = () => {
  localStorage.removeItem('usuario');
  setUsuario(null);
};

return (
  <AuthContext.Provider value={{ usuario, logIn, logOut }}>
    {children}
  </AuthContext.Provider>
);


}

