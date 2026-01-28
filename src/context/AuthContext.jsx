import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const storedRefresh = localStorage.getItem("refreshToken");

      const resp = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
        body:
          import.meta.env.MODE !== "production"
            ? JSON.stringify({ refreshToken: storedRefresh })
            : undefined,
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.msg || "Error al refrescar token");

      const newToken = data.token;
      const usuarioData = data.usuario;

     
      if (import.meta.env.MODE !== "production" && newToken) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
      }

     
      if (usuarioData) {
        setUsuario(usuarioData);
      }

      return true;
    } catch (err) {
      console.error("❌ Error en refresh:", err);
      return false;
    }
  };


  const checkSession = async () => {
    try {
      let resp;
      if (import.meta.env.MODE === "production") {
        resp = await fetch(`${API_URL}/api/auth/check`, { credentials: "include" });
      } else {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return null;
        setToken(storedToken);

        resp = await fetch(`${API_URL}/api/auth/check`, {
          headers: { "Content-Type": "application/json", "x-token": storedToken },
        });
      }

      const data = await resp.json();
      if (!resp.ok || !data?.usuario) return null;

      return data.usuario;
    } catch (err) {
      console.error("❌ Error en check:", err);
      return null;
    }
  };

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const u = await checkSession();
        if (u) {
          setUsuario(u);
        } else {
          const refreshed = await refreshToken();
          if (refreshed) {
            const u2 = await checkSession();
            if (u2) {
              setUsuario(u2);
              return;
            }
          }
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

 
  const logIn = async (usuarioData, tokenData, refreshData) => {

    if (import.meta.env.MODE !== "production") {
      if (tokenData) {
        localStorage.setItem("token", tokenData);
        setToken(tokenData);
      }
      if (refreshData) {
        localStorage.setItem("refreshToken", refreshData);
      }
    }
    setUsuario(usuarioData);
    return usuarioData;
  };

  
  const register = async (formData) => {
    const resp = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify(formData),
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data.msg || "Error en registro");

    if (import.meta.env.MODE !== "production") {
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    }

    setUsuario(data.usuario || null);
    return data.usuario;
  };

 
  const logOut = async () => {
    try {
      if (import.meta.env.MODE === "production") {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
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
    <AuthContext.Provider value={{ usuario, token, cargando, logIn, register, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
