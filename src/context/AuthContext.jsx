import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // 🔄 Rehidratar sesión al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargando(false);
      return;
    }

    const cargarUsuario = async () => {
      try {
        const resp = await fetch("http://localhost:3000/api/auth/me", {
          headers: { "x-token": token }
        });

        if (resp.ok) {
          const data = await resp.json();

          // ✅ Normalizamos el usuario para que siempre tenga "id"
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
        }
      } catch (err) {
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, [navigate]);

  // 👉 Login: guardar token y usuario
  const logIn = (usuarioData, token) => {
    localStorage.setItem("token", token);

    // ✅ Normalizamos también aquí
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
    navigate("/inicio", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👇 Hook personalizado
export const useAuth = () => useContext(AuthContext);







