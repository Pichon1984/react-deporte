import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // 🔄 Rehidratar sesión al montar
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        let resp;

        if (import.meta.env.MODE === "production") {
          // 🔐 Producción: cookie httpOnly
          resp = await fetch(`${API_URL}/api/auth/check`, {
            credentials: "include",
          });
        } else {
          // 🛠 Desarrollo: token en localStorage
          const storedToken = localStorage.getItem("token");
          if (!storedToken) {
            setCargando(false);
            return;
          }
          setToken(storedToken);

          resp = await fetch(`${API_URL}/api/usuarios/me`, {
            headers: {
              "Content-Type": "application/json",
              "x-token": storedToken,
            },
          });
        }

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
        console.error("❌ Error cargando usuario:", err);
        setUsuario(null);
        setToken(null);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, []);

  // 👉 Login
  const logIn = (usuarioData, token) => {
    if (import.meta.env.MODE !== "production") {
      localStorage.setItem("token", token);
      setToken(token);
    }

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

  // 👉 Logout
  const logOut = async () => {
    try {
      if (import.meta.env.MODE === "production") {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("❌ Error en logout:", err);
    } finally {
      setUsuario(null);
      setToken(null);
      navigate("/inicio", { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
