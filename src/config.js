/* const isLocalhost = window.location.hostname === "localhost";

export const API_BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : "https://reflections-hcjq.onrender.com";

*/
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
