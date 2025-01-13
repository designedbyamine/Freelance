const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const { title, description, budget, deadline, skillsRequired } = req.body;

    const project = new Project({
      title,
      description,
      budget,
      deadline,
      skillsRequired,  
      clientId: req.user.id,
    });

    
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a project by ID
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the logged-in user is the client who posted the project
    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Use findByIdAndDelete to remove the project
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getMyProjects = async (req, res) => {
  try {
    // Fetch projects by clientId
    const projects = await Project.find({ clientId: req.user.id });

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this client' });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  getMyProjects,
};
