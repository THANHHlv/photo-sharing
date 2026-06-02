import { API_BASE_URL } from "../config/api";

export default async function postJSON(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error((await response.text()) || `HTTP ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  return contentType.toLowerCase().includes("application/json") ? response.json() : null;
}
