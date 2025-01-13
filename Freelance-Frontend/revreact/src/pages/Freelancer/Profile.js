import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import "../../profile.css";

axios.defaults.baseURL = "http://127.0.0.1:3000/api";

const FreelancerProfile = () => {
  const [profile, setProfile] = useState({
    description: "",
    education: "",
    experience: "",
    languages: [],
    photo: "",
    skills: [],
    category: [],
    experienceLevel: "",
    hourlyRate: "",
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
      const response = await axios.get("/freelancer/myprofile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Profile fetched successfully:", response.data);
      setProfile(response.data);
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
      formData.append("description", profile.description);
      formData.append("education", profile.education);
      formData.append("experience", profile.experience);
      formData.append("languages", profile.languages.join(", "));
      formData.append("skills", profile.skills.join(", "));
      formData.append("category", profile.category.join(", "));
      formData.append("experienceLevel", profile.experienceLevel);
      formData.append("hourlyRate", profile.hourlyRate);
      formData.append("location", profile.location);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await axios.put(
        "/freelancer/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
              src={previewPhoto || profile.photo}
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
            <label>Description</label>
            <input
              type="text"
              className="form-control"
              value={profile.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Education</label>
            <input
              type="text"
              className="form-control"
              value={profile.education}
              onChange={(e) => handleChange("education", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Experience</label>
            <input
              type="text"
              className="form-control"
              value={profile.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Languages</label>
            <input
              type="text"
              className="form-control"
              value={profile.languages.join(", ")}
              onChange={(e) => handleChange("languages", e.target.value.split(", "))}
            />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <input
              type="text"
              className="form-control"
              value={profile.skills.join(", ")}
              onChange={(e) => handleChange("skills", e.target.value.split(", "))}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              className="form-control"
              value={profile.category.join(", ")}
              onChange={(e) => handleChange("category", e.target.value.split(", "))}
            />
          </div>

          <div className="form-group">
            <label>Experience Level</label>
            <input
              type="text"
              className="form-control"
              value={profile.experienceLevel}
              onChange={(e) => handleChange("experienceLevel", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Hourly Rate</label>
            <input
              type="number"
              className="form-control"
              value={profile.hourlyRate}
              onChange={(e) => handleChange("hourlyRate", e.target.value)}
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

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FreelancerProfile;
