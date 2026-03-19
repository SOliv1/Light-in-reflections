const isLocalhost = window.location.hostname === "localhost";

export const API_BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : "https://reflections-hcjq.onrender.com";
