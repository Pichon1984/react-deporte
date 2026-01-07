import { API_URL } from "./api.js";

const DEFAULT_HEADERS = { "Content-Type": "application/json" };

function buildUrl(path) {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function withToken(headers = {}) {
  const token = localStorage.getItem("token"); // o donde lo guardes
  return {
    ...DEFAULT_HEADERS,
    ...headers,
    "x-token": token || "" // 👈 tu proyecto usa x-token en todos los endpoints
  };
}

async function handleResponse(res, url) {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Error parseando respuesta de ${url}`);
  }

  if (!res.ok) {
    const msg = data?.error || `Error en petición ${url}: ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export async function httpGet(path) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "GET",
    headers: withToken(),
    credentials: "include", // 👈 si usás cookies/sesiones
  });
  return handleResponse(res, url);
}

export async function httpPost(path, data) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "POST",
    headers: withToken(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(res, url);
}

export async function httpPut(path, data) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "PUT",
    headers: withToken(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(res, url);
}

export async function httpDelete(path) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "DELETE",
    headers: withToken(),
    credentials: "include",
  });
  return handleResponse(res, url);
}
