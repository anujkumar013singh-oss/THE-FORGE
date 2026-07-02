const API_BASE = import.meta.env.VITE_API_URL || "";

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export default API_BASE;
