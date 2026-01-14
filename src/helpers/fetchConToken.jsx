const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    data = { msg: "Respuesta inválida del servidor" };
  }
  return { ok: res.ok, status: res.status, data };
}

export const fetchConToken = async (url, options = {}) => {
  let headers = { "Content-Type": "application/json", ...options.headers };

  if (import.meta.env.MODE !== "production") {
    const token = localStorage.getItem("token") || "";
    if (token) headers["x-token"] = token;
  }

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body:
          import.meta.env.MODE !== "production"
            ? JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") })
            : undefined,
      });

      const refreshData = await refreshRes.json();
      const newToken = refreshData.token || refreshData.accessToken;

      if (refreshRes.ok) {
        // En desarrollo guardamos el nuevo token en localStorage
        if (import.meta.env.MODE !== "production" && newToken) {
          localStorage.setItem("token", newToken);
        }

        // Reintento de la petición original
        const retryHeaders = { "Content-Type": "application/json", ...options.headers };
        if (import.meta.env.MODE !== "production" && newToken) {
          retryHeaders["x-token"] = newToken;
        }

        res = await fetch(url, { ...options, headers: retryHeaders, credentials: "include" });
      }
    } catch (err) {
      console.error("❌ Error intentando refresh:", err);
    }
  }

  return handleResponse(res);
};

