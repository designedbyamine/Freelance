src/hooks/useAuth.js
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const data = await authService.login(credentials);
      setUser(data.user); // Set user context
      localStorage.setItem("token", data.token); // Save token locally
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials) => {
    try {
      setLoading(true);
      const data = await authService.register(credentials);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Clear the token
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, login, register, logout, loading };
};

export default useAuth;