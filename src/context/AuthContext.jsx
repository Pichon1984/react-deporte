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
          const u = data.usuario || data;
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
          if (resp.status === 401) {
            navigate("/login", { replace: true });
          }
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
  }, [navigate]);

  // 👉 Login
  const logIn = async (correo, password) => {
    try {
      const resp = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔐 en producción se guarda cookie httpOnly
        body: JSON.stringify({ correo, password }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.msg || "Error en login");
      }

      // 🛠 Desarrollo: si devuelve token, guardarlo en localStorage
      if (import.meta.env.MODE !== "production" && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }

      // ⚡ Normalizar usuario
      let usuarioData = data.usuario;
      if (!usuarioData) {
        // Si backend solo devolvió msg, pedimos /check
        const checkResp = await fetch(`${API_URL}/api/auth/check`, {
          headers: {
            "Content-Type": "application/json",
            "x-token": data.token || localStorage.getItem("token") || "",
          },
          credentials: "include",
        });
        const checkData = await checkResp.json();
        usuarioData = checkData.usuario;
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
    } catch (err) {
      console.error("❌ Error en login:", err.message);
      throw err;
    }
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
