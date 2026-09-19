const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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