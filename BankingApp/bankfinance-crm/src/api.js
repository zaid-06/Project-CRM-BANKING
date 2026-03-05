// Simple API helper to talk to the Node backend
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("bankfinance_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getAuthToken = () => {
  const user = getStoredUser();
  return user?.token || null;
};

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Ignore JSON parse errors for empty responses
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (Array.isArray(data?.errors) && data.errors[0]?.msg) ||
      "Request failed";
    throw new Error(message);
  }

  return data;
}

