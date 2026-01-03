import { API_URL } from "../services/api";

// Helper para manejar respuestas
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

const headers = { "Content-Type": "application/json" };

// Registro de usuario
export async function register(datos) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers,
    body: JSON.stringify(datos),
  });
  return handleResponse(res);
}

// Login
export async function login(correo, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({ correo, password }),
  });
  return handleResponse(res);
}

// Perfil del usuario logueado (usando x-token)
export async function getProfile(token) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { "x-token": token },
  });
  return handleResponse(res);
}

// Forgot password
export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: email }),
  });
  return res.json(); // 👈 importante
}



// Reset password
export async function resetPassword(token, newPassword) {
  console.log("📤 Enviando a resetPassword:", { token, newPassword });
  try {
    const res = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: "POST",
      headers,
      body: JSON.stringify({ token, newPassword }), // 👈 ahora coincide con backend
    });
    return handleResponse(res);
  } catch (error) {
    console.error("❌ Error en resetPassword:", error);
    throw error;
  }
}

export const ComprasService = {
  getById: async (id) => {
    if (!id) throw new Error("El ID de la compra es requerido");
    return httpGet(`/api/compras/${encodeURIComponent(id)}`);
  },
};
