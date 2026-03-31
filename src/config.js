const rawApiUrls = process.env.REACT_APP_API_URLS || process.env.REACT_APP_API_URL || "http://localhost:5000";

export const API_BASE_URLS = rawApiUrls
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

export const API_BASE_URL = API_BASE_URLS[0] || "http://localhost:5000";

export default API_BASE_URL;
