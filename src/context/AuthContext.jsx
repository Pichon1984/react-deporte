import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null); // 👈 nuevo estado para token
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // 🔄 Rehidratar sesión al montar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setCargando(false);
      return;
    }

    setToken(storedToken); // 👈 guardamos token en estado

    const cargarUsuario = async () => {
      try {
        const resp = await fetch("http://localhost:3000/api/auth/me", {
          headers: { "x-token": storedToken }
        });

        if (resp.ok) {
          const data = await resp.json();

          const usuarioData = {
            id: data._id || data.id,
            nombre: data.nombre,
            email: data.correo,
            rol: (data.rol || "").toUpperCase(),
            telefono: data.telefono,
            direccion: data.direccion,
            provincia: data.provincia,
            localidad: data.localidad,
            codigoPostal: data.codigoPostal,
            dni: data.dni
          };

          setUsuario(usuarioData);
        } else {
          setUsuario(null);
          setToken(null);
        }
      } catch (err) {
        setUsuario(null);
        setToken(null);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, [navigate]);

  // 👉 Login: guardar token y usuario
  const logIn = (usuarioData, token) => {
    localStorage.setItem("token", token);
    setToken(token); // 👈 guardamos token en estado

    const usuarioNormalizado = {
      id: usuarioData._id || usuarioData.id,
      nombre: usuarioData.nombre,
      email: usuarioData.correo,
      rol: (usuarioData.rol || "").toUpperCase(),
      telefono: usuarioData.telefono,
      direccion: usuarioData.direccion,
      provincia: usuarioData.provincia,
      localidad: usuarioData.localidad,
      codigoPostal: usuarioData.codigoPostal,
      dni: usuarioData.dni
    };

    setUsuario(usuarioNormalizado);
  };

  // 👉 Logout: limpiar token y usuario
  const logOut = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    setToken(null); // 👈 limpiamos token
    navigate("/inicio", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👇 Hook personalizado
export const useAuth = () => useContext(AuthContext);

