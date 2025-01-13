import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../../portfolio.css"; // Import the custom CSS file

axios.defaults.baseURL = "http://127.0.0.1:3000/api";

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [newPortfolio, setNewPortfolio] = useState({
    title: "",
    description: "",
    skills: "",
    media: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showForm, setShowForm] = useState(false); // New state to control form visibility

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("/portfolio/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPortfolioItems(response.data);
    } catch (err) {
      setError("Error fetching portfolio items.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPortfolio({ ...newPortfolio, [name]: value });
  };

  const handleMediaChange = (e) => {
    setMediaFiles(e.target.files);
  };

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newPortfolio.title);
    formData.append("description", newPortfolio.description);
    formData.append("skills", newPortfolio.skills);
    for (const file of mediaFiles) {
      formData.append("media", file);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await axios.post("/portfolio", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setPortfolioItems([...portfolioItems, response.data]);
      setNewPortfolio({ title: "", description: "", skills: "", media: [] });
      setMediaFiles([]);
      toast.success("Portfolio item added successfully!");
    } catch (err) {
      setError("Error adding portfolio item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (id) => {
    // Confirm deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this portfolio item?");
    if (!isConfirmed) return; // Do nothing if the user cancels

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      await axios.delete(`/portfolio/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update portfolioItems after successful deletion
      setPortfolioItems((prevItems) => prevItems.filter((item) => item._id !== id));

      toast.success("Portfolio item deleted successfully!");
    } catch (err) {
      setError("Error deleting portfolio item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container portfolio-container">
      <h1>My Portfolio</h1>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Button to toggle form visibility */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn btn-primary mb-3"
      >
        {showForm ? "Hide Form" : "Add New Portfolio Item"}
      </button>

      {/* Portfolio Form (hidden by default) */}
      {showForm && (
        <form onSubmit={handleAddPortfolio} className="portfolio-form mb-4">
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Title"
            value={newPortfolio.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            className="form-control"
            placeholder="Description"
            value={newPortfolio.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="skills"
            className="form-control"
            placeholder="Skills (comma-separated)"
            value={newPortfolio.skills}
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            name="media"
            className="form-control-file"
            multiple
            onChange={handleMediaChange}
            required
          />
          <button
            type="submit"
            className="btn btn-success w-100 mt-2"
          >
            {loading ? "Adding..." : "Add Portfolio"}
          </button>
        </form>
      )}

      {/* Portfolio Items */}
      <div className="portfolio-list row">
        {portfolioItems.map((item) => (
          <div key={item._id} className="col-md-12 mb-4">
            <div className="portfolio-item card shadow-sm">
              <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p>{item.description}</p>
                <p>Skills: {item.skills.join(", ")}</p>
                <div className="portfolio-media">
                  {item.media.map((mediaPath, index) => {
                    const mediaUrl = `http://localhost:3000/${mediaPath}`;
                    return (
                      <img
                        key={index}
                        src={mediaUrl}
                        alt={`Portfolio media ${index + 1}`}
                        className="portfolio-media-img img-fluid"
                      />
                    );
                  })}
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeletePortfolio(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Portfolio;
