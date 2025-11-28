import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const logIn = (user) => {
    setUsuario(user);
    localStorage.setItem('usuario', JSON.stringify(user));
  };

  const logOut = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}






