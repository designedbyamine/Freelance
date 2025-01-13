import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios';
import '../../myprojects.css'; // Importing the CSS for styling

axios.defaults.baseURL = "http://127.0.0.1:3000/api";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    skillsRequired: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false); // State to toggle form visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal visibility
  const [projectToDelete, setProjectToDelete] = useState(null); // Store project ID to delete
  const navigate = useNavigate(); // Initialize navigation

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/projects/myprojects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('/projects', newProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prevProjects) => [...prevProjects, response.data]);
      setNewProject({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        skillsRequired: '',
      });
      setIsFormVisible(false); // Hide the form after successful project creation
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/projects/${projectToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectToDelete)
      );
      setIsDeleteModalOpen(false); // Close the modal after deletion
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleViewOffers = (projectId) => {
    console.log("Navigating to:", `/client/projects/${projectId}/offers`);
    console.log('ProjectId:', projectId);
    navigate(`/client/projects/${projectId}/offers`);
  };

  const openDeleteModal = (projectId) => {
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false); // Close the modal without doing anything
    setProjectToDelete(null); // Clear the project ID
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="my-projects">
      <h1>My Projects</h1>
      {error && <p className="error-message">{error}</p>}

      <button
        className="add-project-btn"
        onClick={() => setIsFormVisible((prev) => !prev)} // Toggle form visibility
      >
        {isFormVisible ? 'Cancel' : 'Add New Project'}
      </button>

      {isFormVisible && (
        <form onSubmit={handleCreateProject} className="show-form">
          <h2>Create New Project</h2>
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={newProject.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={newProject.description}
            onChange={handleInputChange}
            required
          ></textarea>
          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={newProject.budget}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="deadline"
            placeholder="Deadline"
            value={newProject.deadline}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="skillsRequired"
            placeholder="Required Skills (comma-separated)"
            value={newProject.skillsRequired}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Create Project</button>
        </form>
      )}

      <h2>Your Projects</h2>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p>Budget: ${project.budget}</p>
              <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
              <p>Skills Required: {project.skillsRequired.join(', ')}</p>
              <button
                onClick={() => openDeleteModal(project._id)}
                className="delete-btn"
              >
                Delete
              </button>
              <button
                onClick={() => handleViewOffers(project._id)}
                className="view-btn"
              >
                View Offers
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Are you sure you want to delete this project?</h4>
            <div className="modal-buttons">
              <button className="btn-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleDeleteProject}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
