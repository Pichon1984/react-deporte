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
    // devolver error claro
    return { error: true, status: res.status, ...data };
  }

  return data;
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

// Perfil del usuario logueado
export async function getProfile(token) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

// Forgot password
export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers,
    body: JSON.stringify({ correo: email }),
  });

  const data = await handleResponse(res);
  // ⚠️ Solo loguear en desarrollo
  if (import.meta.env.DEV) {
    console.log("🔍 Respuesta forgotPassword:", data);
  }
  return data;
}

// Reset password
export async function resetPassword(token, newPassword) {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers,
    body: JSON.stringify({ token, newPassword }),
  });
  return handleResponse(res);
}
