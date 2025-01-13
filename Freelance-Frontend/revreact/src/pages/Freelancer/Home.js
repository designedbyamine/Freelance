import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is installed and configured for making requests
import '../../freelancerpage.css';
axios.defaults.baseURL = "http://127.0.0.1:3000/api";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [offerData, setOfferData] = useState({}); // State to store offer data for each project
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State to hold success message

  // State to manage offer form visibility per project
  const [showOfferForms, setShowOfferForms] = useState({});

  // Fetch all projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Assuming you store the token in localStorage
        if (!token) {
          setError("No token found, please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("/projects/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle offer data change for a specific project
  const handleOfferChange = (projectId, e) => {
    const { name, value } = e.target;
    setOfferData((prevData) => ({
      ...prevData,
      [projectId]: {
        ...prevData[projectId],
        [name]: value,
      },
    }));
  };

  // Handle making an offer
  const handleOffer = async (projectId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to make an offer.");
        return;
      }

      const response = await axios.post(
        "/offers/",
        {
          ...offerData[projectId], // Use the offer data for the specific project
          projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Offer submitted successfully!"); // Set success message
        setTimeout(() => setSuccessMessage(""), 5000); // Hide the message after 5 seconds
      } else {
        alert("Failed to submit offer.");
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      alert(`An error occurred: ${error.response?.data?.message || error.message}`);
    }
  };

  // Toggle the visibility of the offer form for each project
  const toggleOfferForm = (projectId) => {
    setShowOfferForms((prevState) => ({
      ...prevState,
      [projectId]: !prevState[projectId],
    }));
  };

  return (
    <div className="freelancer-home-container">
    <div className="freelancer-home-header">
        <h1>Welcome, Freelancer!</h1>
    </div>

    <div className="freelancer-home-body">
        <div className="freelancer-projects-list">
          <h3>All Available Projects</h3>

          {loading && <div>Loading projects...</div>}
          {error && <div>{error}</div>}

          <div className="row">
            {projects.map((project) => (
              <div key={project._id} className="mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{project.title}</h5>
                    <p className="card-text">{project.description}</p>

                    {/* Display Skills Required, Budget, Deadline */}
                    <div className="card-body">
                      <strong>Skills Required: </strong>
                      <ul>
                        {project.skillsRequired.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                      <strong>Budget: </strong>
                      <p>${project.budget}</p>
                      <strong>Deadline: </strong>
                      <p>{new Date(project.deadline).toLocaleDateString()}</p>
                    </div>

                    {/* Button to toggle the offer form visibility */}
                    <button
                      className="btn btn-secondary mb-3"
                      onClick={() => toggleOfferForm(project._id)}
                    >
                      {showOfferForms[project._id] ? "Hide Offer Form" : "Make an Offer"}
                    </button>

                    {/* Offer Form with animation */}
                    <div
                      className={`offer-form-container ${showOfferForms[project._id] ? "show" : ""}`}
                    >
                      {showOfferForms[project._id] && (
                        <div>
                          <div className="form-group mb-3">
                            <label htmlFor="bidAmount">Bid Amount</label>
                            <input
                              type="number"
                              id="bidAmount"
                              name="bidAmount"
                              value={offerData[project._id]?.bidAmount || ""}
                              onChange={(e) => handleOfferChange(project._id, e)}
                              className="form-control"
                              placeholder="Enter your bid amount"
                            />
                          </div>

                          <div className="form-group mb-3">
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input
                              type="text"
                              id="estimatedTime"
                              name="estimatedTime"
                              value={offerData[project._id]?.estimatedTime || ""}
                              onChange={(e) => handleOfferChange(project._id, e)}
                              className="form-control"
                              placeholder="Enter estimated time (e.g. 2 weeks)"
                            />
                          </div>

                          <div className="form-group mb-3">
                            <label htmlFor="message">Message</label>
                            <textarea
                              id="message"
                              name="message"
                              value={offerData[project._id]?.message || ""}
                              onChange={(e) => handleOfferChange(project._id, e)}
                              className="form-control"
                              placeholder="Write your message"
                            />
                          </div>

                          <button
                            className="btn btn-primary"
                            onClick={() => handleOffer(project._id)}
                          >
                            Submit Offer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-sidebar">
        <p>Other content for freelancers (e.g., profile info, notifications, etc.)</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="freelancer-success-message">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Home;
