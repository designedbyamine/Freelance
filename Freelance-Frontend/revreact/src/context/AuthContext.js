import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService"; // Assuming authService is in this folder

// Create Context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User will store { role: 'client' | 'freelancer', ... }
  const [isAuthenticated, setIsAuthenticated] = useState(false); // To track if the user is authenticated

  // Load user from localStorage on app load (for persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData); // Set user from localStorage or JWT payload (if available)
      setIsAuthenticated(true); // Mark the user as authenticated
    } else {
      setIsAuthenticated(false); // If no user is in localStorage, mark as unauthenticated
    }
  }, []); // Only runs once when the component is mounted

  // Login method to set user and persist in localStorage
  const login = (userData) => {
    setUser(userData); // Set user data from login response
    setIsAuthenticated(true); // Mark user as authenticated
    localStorage.setItem("user", JSON.stringify(userData)); // Save user in localStorage
  };

  // Logout method to clear user data and remove from localStorage
  const logout = () => {
    setUser(null); // Clear user state
    setIsAuthenticated(false); // Mark user as unauthenticated
    localStorage.removeItem("user"); // Remove user from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, login, logout }}>
      {children} {/* Pass down the AuthContext to all child components */}
    </AuthContext.Provider>
  );
};
