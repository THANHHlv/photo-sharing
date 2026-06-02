import { API_BASE_URL } from "../config/api";

export default async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append("uploadedphoto", file);
  const response = await fetch(`${API_BASE_URL}/photos/new`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!response.ok) throw new Error((await response.text()) || "Upload failed");
  return response.json();
}
