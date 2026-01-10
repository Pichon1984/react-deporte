const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const fetchConToken = async (endpoint, options = {}) => {
  let headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  let fetchOptions = { ...options, headers };

  if (import.meta.env.MODE === "production") {
    // 🔐 Producción: usar cookie httpOnly
    fetchOptions.credentials = "include";
  } else {
    // 🛠 Desarrollo: usar token en localStorage
    const token = localStorage.getItem("token") || "";
    headers["x-token"] = token;
  }

  const resp = await fetch(`${API_URL}${endpoint}`, fetchOptions);

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

