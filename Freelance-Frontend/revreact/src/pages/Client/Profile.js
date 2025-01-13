import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../profile.css";

axios.defaults.baseURL = "http://127.0.0.1:3000/api";

const ClientProfile = () => {
  const [profile, setProfile] = useState({
    companyName: "",
    industry: "",
    paymentMethods: [], // Ensuring paymentMethods is always an array
    photo: "",
    location: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("/client/myprofile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Profile fetched successfully:", response.data);
      // Ensure paymentMethods is initialized as an empty array if not present
      setProfile({
        ...response.data,
        paymentMethods: response.data.paymentMethods || [],
      });
    } catch (err) {
      console.error("Failed to load profile:", err.response || err.message);
      setError("Failed to load profile. Please try again later.");
    }
  }, []);

  // Initial profile fetch on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle input change
  const handleChange = useCallback((field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle photo file change and preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);

    if (file) {
      setPreviewPhoto(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  // Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const formData = new FormData();
      formData.append("companyName", profile.companyName);
      formData.append("industry", profile.industry);
      formData.append("location", profile.location);

      if (Array.isArray(profile.paymentMethods) && profile.paymentMethods.length > 0) {
        formData.append("paymentMethods", profile.paymentMethods.join(", "));
      }

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await axios.put("/client/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile updated successfully:", response.data);

      fetchProfile(); // Re-fetch profile data after update
      toast.success("Profile updated successfully! 🎉", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    } catch (err) {
      console.error("Failed to update profile:", err.response || err.message);
      setError("Failed to update profile. Please try again later.");
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-form-card">
        <h1>Edit Your Profile</h1>

        {/* Display current photo or preview new photo */}
        <div className="profile-photo-container">
          {previewPhoto || profile.photo ? (
            <img
            src={previewPhoto || `http://127.0.0.1:3000${profile.photo}`}
            alt="Profile"
            className="img-fluid"
            />
          ) : (
            <span>No Photo</span>
          )}

          <input
            type="file"
            className="form-control"
            onChange={handlePhotoChange}
            accept="image/*"
          />
        </div>

        {/* Profile form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              className="form-control"
              value={profile.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Industry</label>
            <input
              type="text"
              className="form-control"
              value={profile.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              value={profile.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Payment Methods</label>
            <input
              type="text"
              className="form-control"
              value={profile.paymentMethods ? profile.paymentMethods.join(", ") : ""}
              onChange={(e) => handleChange("paymentMethods", e.target.value.split(", "))}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ClientProfile;
