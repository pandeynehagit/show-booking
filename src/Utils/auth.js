import {jwtDecode} from "jwt-decode";

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false; // No token found
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp > currentTime) {
      return true; // Token is valid
    } else {
      localStorage.removeItem("token"); // Remove expired token
      return false;
    }
  } catch (err) {
    console.error("Error decoding token:", err.message);
    localStorage.removeItem("token"); // Remove invalid token
    return false;
  }
};
