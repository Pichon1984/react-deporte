const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://base-datos-deporte.vercel.app");

// 🔹 Manejo de respuestas
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

// 🔹 Headers con token opcional
function getHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { "x-token": token } : {}),
  };
}

// --- Endpoints de Productos ---
export async function getProductos(categoria, page = 1, limit = 12) {
  // ✅ Detecta si es ObjectId o nombre
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(categoria);

  const url = isObjectId
    ? `${API_URL}/api/categorias/id/${categoria}/productos?page=${page}&limit=${limit}`
    : `${API_URL}/api/categorias/nombre/${categoria}/productos?page=${page}&limit=${limit}`;

  const res = await fetch(url);
  return handleResponse(res);
}

export async function getProductoById(id) {
  const res = await fetch(`${API_URL}/api/productos/${id}`);
  return handleResponse(res);
}

// --- Endpoints de Categorías ---
export async function getCategorias() {
  const res = await fetch(`${API_URL}/api/categorias`);
  return handleResponse(res);
}

// --- Endpoints de Auth ---
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
  });
  return handleResponse(res);
}

export async function getProfile(token) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: getHeaders(token),
  });
  return handleResponse(res);
}

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

// --- Endpoints de Carrito ---
export async function getCarrito(token) {
  const res = await fetch(`${API_URL}/api/carrito`, {
    headers: getHeaders(token),
  });
  return handleResponse(res);
}

export async function addToCarrito(token, productoId, cantidad = 1) {
  const res = await fetch(`${API_URL}/api/carrito`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ productoId, cantidad }),
  });
  return handleResponse(res);
}

export async function removeFromCarrito(token, productoId) {
  const res = await fetch(`${API_URL}/api/carrito/${productoId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  return handleResponse(res);
}

// 🔹 Exporta la constante para que otros componentes puedan usarla
export { API_URL };

