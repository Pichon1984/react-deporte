import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Usamos la variable de entorno para el backend
const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // 🔄 Rehidratar sesión al montar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setCargando(false);
      return;
    }

    setToken(storedToken);

    const cargarUsuario = async () => {
      try {
        const resp = await fetch(`${API_URL}/api/usuarios/me`, {
          headers: {
            "Content-Type": "application/json",
            "x-token": storedToken, // 👈 tu backend espera este header
          },
        });

        if (resp.ok) {
          const data = await resp.json();

          const usuarioData = {
            id: data._id || data.id,
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            rol: (data.rol || "").toUpperCase(),
            telefono: data.telefono,
            direccion: data.direccion,
            provincia: data.provincia,
            localidad: data.localidad,
            codigoPostal: data.codigoPostal,
            dni: data.dni,
          };

          setUsuario(usuarioData);
        } else {
          setUsuario(null);
          setToken(null);
        }
      } catch (err) {
        console.error("Error cargando usuario:", err);
        setUsuario(null);
        setToken(null);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, []); // 👈 solo al montar, no depende de navigate

  // 👉 Login: guardar token y usuario
  const logIn = (usuarioData, token) => {
    localStorage.setItem("token", token);
    setToken(token);

    const usuarioNormalizado = {
      id: usuarioData._id || usuarioData.id,
      nombre: usuarioData.nombre,
      apellido: usuarioData.apellido,
      correo: usuarioData.correo,
      rol: (usuarioData.rol || "").toUpperCase(),
      telefono: usuarioData.telefono,
      direccion: usuarioData.direccion,
      provincia: usuarioData.provincia,
      localidad: usuarioData.localidad,
      codigoPostal: usuarioData.codigoPostal,
      dni: usuarioData.dni,
    };

    setUsuario(usuarioNormalizado);
  };

  // 👉 Logout: limpiar token y usuario
  const logOut = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    setToken(null);
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
