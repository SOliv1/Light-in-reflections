//export const API_BASE_URL =
  //process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  //export const API_BASE_URL = "https://reflections-in-light.onrender.com";


const isLocalhost = window.location.hostname === "localhost";

export const API_BASE_URL = isLocalhost
  ? "http://localhost:5000"  // local backend
  : "https://reflections-hcjq.onrender.com";  // deployed backend
