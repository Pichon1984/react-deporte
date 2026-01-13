import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate(); 

  //  Rehidratar sesión al montar
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        let resp;

        if (import.meta.env.MODE === "production") {
     
          resp = await fetch(`${API_URL}/api/auth/check`, {
            credentials: "include",
          });
        } else {
       
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


  const logIn = (usuarioData, tokenData) => {
    if (import.meta.env.MODE !== "production" && tokenData) {
      localStorage.setItem("token", tokenData);
      setToken(tokenData);
    }
    setUsuario(usuarioData);
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

