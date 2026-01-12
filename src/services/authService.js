
async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    data = { msg: "Respuesta inválida del servidor" };
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
  };
}

// 👉 Normalizar API_URL (evitar doble barra final)
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// 👉 Headers comunes
const headers = { "Content-Type": "application/json" };

// 👉 Registro de usuario
export async function register(datos) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers,
    body: JSON.stringify(datos),
    credentials: "include", // 🔑 guarda cookie en producción
  });
  return handleResponse(res);
}

// 👉 Login
export async function login(correo, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({ correo, password }),
    credentials: "include", // 🔑 guarda cookie en producción
  });
  return handleResponse(res);
}

// 👉 Perfil del usuario logueado
export async function getProfile() {
  const token = localStorage.getItem("token") || "";

  const res = await fetch(`${API_URL}/api/auth/check`, {
    headers: {
      ...headers,
      // En desarrollo se usa header x-token, en producción viaja cookie httpOnly
      ...(import.meta.env.MODE !== "production" ? { "x-token": token } : {}),
    },
    credentials: "include",
  });
  return handleResponse(res);
}

// 👉 Forgot password
export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers,
    body: JSON.stringify({ correo: email }), // 👈 backend espera "correo"
    credentials: "include",
  });
  return handleResponse(res);
}

// 👉 Reset password
export async function resetPassword(token, newPassword) {
  console.log("📤 Enviando a resetPassword:", { token, newPassword });
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers,
    body: JSON.stringify({ token, newPassword }),
    credentials: "include",
  });
  return handleResponse(res);
}

// 👉 Logout
export async function logout() {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include", // 🔑 borra cookie en producción
  });

  // En desarrollo se usa localStorage
  if (import.meta.env.MODE !== "production") {
    localStorage.removeItem("token");
  }

  return handleResponse(res);
}


