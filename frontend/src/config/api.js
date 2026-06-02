/**
 * API Configuration for Photo Sharing App
 * Update API_BASE_URL if backend URL changes
 */

const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
	throw new Error("Missing REACT_APP_API_URL. Create frontend/.env.local with REACT_APP_API_URL=http://localhost:8080");
}

export { API_BASE_URL };
