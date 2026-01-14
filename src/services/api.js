// --- Config base ---
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://base-datos-deporte.vercel.app");

// --- Manejo de respuestas ---
async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    data = { msg: "Respuesta inválida del servidor" };
  }

  if (!res.ok) {
    return { ok: false, status: res.status, data };
  }

  return { ok: true, status: res.status, data };
}

// --- Headers con token opcional ---
function getHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { "x-token": token } : {}),
  };
}

// --- Util de sesión ---
export function logout() {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  } catch {}
}

export async function checkAuth() {
  const res = await fetch(`${API_URL}/api/auth/check`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse(res);
}

// --- Fetch con refresh automático ---
async function fetchWithRefresh(url, options = {}) {
  // 🔹 Lectura defensiva: primero accessToken, luego legacy "token"
  let token = localStorage.getItem("accessToken");
  const legacyToken = !token ? localStorage.getItem("token") : null;

  if (!token && legacyToken) {
    token = legacyToken;
    try { localStorage.setItem("accessToken", legacyToken); } catch {}
  }

  options.headers = {
    ...(options.headers || {}),
    ...getHeaders(token),
  };
  options.credentials = "include";

  let res = await fetch(url, options);
  let result = await handleResponse(res);

  const isExpired401 =
    result.status === 401 &&
    (result.data?.msg?.includes("jwt expired") ||
      result.data?.error?.includes("jwt expired"));

  const isMissingOrInvalid401 =
    result.status === 401 &&
    (String(result.data?.msg || "").toLowerCase().includes("no hay token") ||
     String(result.data?.msg || "").toLowerCase().includes("no token") ||
     String(result.data?.error || "").toLowerCase().includes("invalid token"));

  if (isExpired401) {
    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    const refreshData = await handleResponse(refreshRes);
    if (refreshData.ok && (refreshData.data?.accessToken || refreshData.data?.token)) {
      const newToken = refreshData.data.accessToken || refreshData.data.token;
      try { localStorage.setItem("accessToken", newToken); } catch {}

      options.headers = {
        ...(options.headers || {}),
        ...getHeaders(newToken),
      };
      res = await fetch(url, options);
      result = await handleResponse(res);
    } else {
      logout();
    }
  } else if (isMissingOrInvalid401) {
    logout();
  }

  return result;
}

// --- Endpoints de Productos (públicos) ---
export async function getProductos(categoriaId, page = 1, limit = 12) {
  const url = `${API_URL}/api/categorias/${categoriaId}/productos?page=${page}&limit=${limit}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function getProductoById(id) {
  const res = await fetch(`${API_URL}/api/productos/${id}`);
  return handleResponse(res);
}

// --- Endpoints de Categorías (públicos) ---
export async function getCategorias() {
  const res = await fetch(`${API_URL}/api/categorias`);
  return handleResponse(res);
}

// --- Endpoints de Auth (públicos) ---
export async function register(datos) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(datos),
  });
  return handleResponse(res);
}

export async function login(correo, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ correo, password }),
    credentials: "include",
  });
  const data = await handleResponse(res);

  // 🔹 Tu backend devuelve "token" y "refreshToken"
  const jwt = data.data?.token;
  if (data.ok && jwt) {
    try {
      localStorage.setItem("accessToken", jwt);
      localStorage.setItem("token", jwt); // compatibilidad legacy
    } catch {}
  }

  if (data.data?.refreshToken) {
    try { localStorage.setItem("refreshToken", data.data.refreshToken); } catch {}
  }

  return data;
}

// --- Perfil del usuario autenticado (protegido) ---
export async function getProfile() {
  return fetchWithRefresh(`${API_URL}/api/usuarios/me`);
}

// --- Endpoints de recuperación de contraseña (públicos) ---
export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ correo: email }),
  });
  return handleResponse(res);
}

export async function resetPassword(token, newPassword) {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ token, newPassword }),
  });
  return handleResponse(res);
}

// --- Endpoints de Carrito (protegidos) ---
export async function getCarrito() {
  return fetchWithRefresh(`${API_URL}/api/carrito`);
}

export async function addToCarrito(productoId, cantidad = 1) {
  return fetchWithRefresh(`${API_URL}/api/carrito`, {
    method: "POST",
    body: JSON.stringify({ productoId, cantidad }),
  });
}

export async function removeFromCarrito(productoId) {
  return fetchWithRefresh(`${API_URL}/api/carrito/${productoId}`, {
    method: "DELETE",
  });
}

// --- Endpoints de Usuarios (protegidos) ---
export async function getUsuarios(page = 1, limit = 10, searchTerm = "") {
  const url = searchTerm
    ? `${API_URL}/api/usuarios?search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`
    : `${API_URL}/api/usuarios?page=${page}&limit=${limit}`;
  return fetchWithRefresh(url);
}

export async function updateUsuarioEstado(id, estado) {
  return fetchWithRefresh(`${API_URL}/api/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });
}

export async function deleteUsuario(id) {
  return fetchWithRefresh(`${API_URL}/api/usuarios/${id}`, {
    method: "DELETE",
  });
}

// --- Endpoints de Compras (protegidos) ---
export async function getCompras(page = 1, limit = 10, filtros = {}) {
  const qp = new URLSearchParams();
  if (filtros.estado) qp.append("estado", filtros.estado);
  if (filtros.desde) qp.append("desde", filtros.desde);
  if (filtros.hasta) qp.append("hasta", filtros.hasta);
  qp.append("page", page);
  qp.append("limit", limit);

  return fetchWithRefresh(`${API_URL}/api/compras?${qp.toString()}`);
}

export async function confirmarPago(id) {
  return fetchWithRefresh(`${API_URL}/api/compras/${id}/confirmar-pago`, {
    method: "PUT",
  });
}

export async function actualizarEnvio(id, datos) {
  return fetchWithRefresh(`${API_URL}/api/compras/${id}/envio`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

// --- Endpoints de Consultas (protegidos) ---
export async function getConsultas(page = 1, limit = 10) {
  return fetchWithRefresh(`${API_URL}/api/consultas/todas?page=${page}&limit=${limit}`);
}

export async function responderConsulta(id, respuesta) {
  return fetchWithRefresh(`${API_URL}/api/consultas/${id}/responder`, {
    method: "PUT",
    body: JSON.stringify({ respuesta }),
  });
}

export async function deleteConsulta(id) {
  return fetchWithRefresh(`${API_URL}/api/consultas/${id}`, {
    method: "DELETE",
  });
}

// --- Export util ---
export { API_URL };
