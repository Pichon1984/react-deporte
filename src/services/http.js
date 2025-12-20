import { API_URL } from "./api.js";

const DEFAULT_HEADERS = { "Content-Type": "application/json" };

function buildUrl(path) {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function httpGet(path) {
  const res = await fetch(buildUrl(path));
  return res.json();
}

export async function httpPost(path, data) {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(data),
  });
  return res.json();
}

