import { API_URL } from "../services/api";

// Helper para manejar respuestas
async function handleResponse(res) {
  try {
    const data = await res.json();
    return data;
  } catch {
    return { msg: "Respuesta inválida del servidor", status: res.status };
  }
}

// Registro de usuario
export async function register(datos) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return handleResponse(res);
}

// Login
export async function login(correo, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
export async function forgotPassword(correo) {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo }),
  });
  return handleResponse(res);
}

// Reset password
export async function resetPassword(token, newPassword) {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  return handleResponse(res);
}
