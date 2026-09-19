export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }

  return data;
}

export function analyzeWater(payload) {
  return request("/analysis", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function askAssistant(question) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ question })
  });
}
// FastAPI serves /openapi.json at the server root by default, so this is a cheap 200 that
// keeps the browser console quiet. Any HTTP response still counts as reachable.
const HEALTH_URL = new URL("/openapi.json", new URL(API_BASE, window.location.href).origin).toString();

/**
 * Reports whether this browser can reach the backend.
 * A network error, CORS block or timeout means it cannot.
 */
export async function checkService(timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(HEALTH_URL, { method: "GET", signal: controller.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
