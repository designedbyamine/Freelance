import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    name: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");  // New state for success message

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate required fields
    if (!formData.email || !formData.password || !formData.role || !formData.name) {
      setErrors({
        name: !formData.name ? "Name is required" : "",
        email: !formData.email ? "Email is required" : "",
        password: !formData.password ? "Password is required" : "",
        role: !formData.role ? "Role is required" : "",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData);
      console.log(response); // Check the full response

      if (response.success) {
        setSuccessMessage("Registration successful! Redirecting to login...");

        // Wait 2 seconds before redirecting to the login page
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrors({ form: response.message || "Registration failed. Please try again." });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors({ form: "An unexpected error occurred. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: "600px" }}>
        <div className="card-body">
          <h3 className="text-center mb-4">Register</h3>

          {/* Display form-wide error messages */}
          {errors.form && (
            <div className="alert alert-danger text-center" aria-live="polite">
              {errors.form}
            </div>
          )}

          {/* Display success message */}
          {successMessage && (
            <div className="alert alert-success text-center" aria-live="polite">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className="form-group mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Enter your name"
                aria-describedby="nameError"
              />
              {errors.name && (
                <div id="nameError" className="invalid-feedback">
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Enter your email"
                aria-describedby="emailError"
              />
              {errors.email && (
                <div id="emailError" className="invalid-feedback">
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="Enter a secure password"
                aria-describedby="passwordError"
              />
              {errors.password && (
                <div id="passwordError" className="invalid-feedback">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Role Field */}
            <div className="form-group mb-4">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`form-control ${errors.role ? "is-invalid" : ""}`}
                aria-describedby="roleError"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="client">Client</option>
                <option value="freelancer">Freelancer</option>
              </select>
              {errors.role && (
                <div id="roleError" className="invalid-feedback">
                  {errors.role}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
