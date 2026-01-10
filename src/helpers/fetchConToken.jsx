const API_URL = import.meta.env.VITE_API_URL;

export const fetchConToken = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token") || "";

  const headers = {
    "Content-Type": "application/json",
    "x-token": token, // 👈 siempre mandar token
    ...(options.headers || {}),
  };

  const resp = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (!resp.ok) {
    let msg = `Error ${resp.status}`;
    try {
      const dataError = await resp.json();
      msg = dataError.error || dataError.msg || msg;
    } catch {
      // fallback si no hay JSON
    }
    throw new Error(msg);
  }

  return await resp.json();
};
