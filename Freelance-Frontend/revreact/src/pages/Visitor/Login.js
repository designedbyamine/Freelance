import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRedirect = (role) => {
    if (role === "client") {
      navigate("/client/projects");
    } else if (role === "freelancer") {
      navigate("/freelancer/home");
    } else {
      setErrors({ form: "Invalid user role" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!formData.email || !formData.password) {
      setErrors({
        email: !formData.email ? "Email is required" : "",
        password: !formData.password ? "Password is required" : "",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login(formData, setUser, setIsAuthenticated);
      if (response.success) {
        const user = authService.getCurrentUser();
        if (user) {
          toast.success("Login successful! Redirecting...", {
            onClose: () => handleRedirect(user.role),
          });
        } else {
          console.error("No user data found in token.");
        }
      } else {
        setErrors({ form: response.message || "Login failed" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({ form: "An error occurred during login" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-5 d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter your password"
              required
            />
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>
          {errors.form && <div className="alert alert-danger">{errors.form}</div>}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
