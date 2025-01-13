import axios from "axios";

// Create Axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  timeout: 10000, // Set a timeout for requests (optional)
});

// Request interceptor: Add authorization token to every request if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Updated key name for clarity
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors and token expiration
api.interceptors.response.use(
  (response) => response, // If response is successful, simply return it
  (error) => {
    if (error.response) {
      // Server responded with a status code outside the range of 2xx
      console.error("API Error Response:", error.response);

      // Handle token expiration (401 Unauthorized)
      if (error.response.status === 401) {
        console.warn("Token expired or unauthorized. Logging out...");
        localStorage.removeItem("authToken"); // Remove token from storage
        window.location.href = "/login"; // Redirect to login page
      }

      // Optionally, handle other specific status codes (e.g., 403, 404, 500)
    } else if (error.request) {
      // No response received from the server
      console.error("No response from server:", error.request);
    } else {
      // Error occurred while setting up the request
      console.error("Error in API setup:", error.message);
    }

    // Reject the promise with the error object
    return Promise.reject(error);
  }
);

export default api;
