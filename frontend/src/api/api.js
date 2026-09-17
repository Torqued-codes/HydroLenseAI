const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export function analyzeWaterQuality(values) {
  return request("/analysis", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function sendChatMessage(question) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ question })
  });
}

export { API_BASE_URL };