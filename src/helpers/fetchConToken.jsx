const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const fetchConToken = async (endpoint, options = {}) => {
  // 🔧 Construimos headers base
  let headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // 🔧 Configuración según entorno
  let fetchOptions = {
    ...options,
    headers,
    credentials: import.meta.env.MODE === "production" ? "include" : "same-origin",
  };

  // 🛠 Desarrollo: usar token en localStorage
  if (import.meta.env.MODE !== "production") {
    const token = localStorage.getItem("token") || "";
    if (token) {
      fetchOptions.headers["x-token"] = token;
    }
  }

  // 🚀 Hacemos la petición
  const resp = await fetch(`${API_URL}${endpoint}`, fetchOptions);

  // ⚠️ Manejo de errores
  if (!resp.ok) {
    let msg = `Error ${resp.status}`;
    try {
      const dataError = await resp.json();
      msg = dataError.error || dataError.msg || msg;
    } catch {
      // fallback si no hay JSON
    }

    // Si el token expiró → logout automático
    if (resp.status === 401) {
      // Podés implementar tu lógica de logout aquí
      // Ejemplo:
      localStorage.removeItem("token");
      // window.location.href = "/login"; // redirigir al login
    }

    throw new Error(msg);
  }

  return await resp.json();
};
