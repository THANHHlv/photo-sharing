import { API_BASE_URL } from "../config/api";

export default async function fetchModelData(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, { credentials: "include" });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${API_BASE_URL}${path}`);
  return response.json();
}
