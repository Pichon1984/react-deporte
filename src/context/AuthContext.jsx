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

          resp = await fetch(`${API_URL}/api/auth/check`, {
            headers: {
              "Content-Type": "application/json",
              "x-token": storedToken,
            },
          });
        }

        if (resp.ok) {
          const data = await resp.json();
          const u = data.usuario || data; // backend puede devolver {usuario:{...}} o {...}
          const usuarioData = {
            id: u._id || u.id,
            nombre: u.nombre,
            apellido: u.apellido,
            correo: u.correo,
            rol: (u.rol || "").toUpperCase(),
            telefono: u.telefono,
            direccion: u.direccion,
            provincia: u.provincia,
            localidad: u.localidad,
            codigoPostal: u.codigoPostal,
            dni: u.dni,
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
  const logIn = async (usuarioData, token) => {
    if (import.meta.env.MODE !== "production") {
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
      }
    }

    // ⚡ Si no recibimos usuario en el login, pedimos /check
    if (!usuarioData || !usuarioData.nombre) {
      try {
        const resp = await fetch(`${API_URL}/api/auth/check`, {
          headers: {
            "Content-Type": "application/json",
            "x-token": token || localStorage.getItem("token") || "",
          },
          credentials: "include",
        });
        const data = await resp.json();
        usuarioData = data.usuario || data;
      } catch (err) {
        console.error("❌ Error verificando usuario en login:", err);
      }
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
