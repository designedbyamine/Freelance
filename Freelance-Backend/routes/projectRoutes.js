const express = require('express');
const { protect } = require('../middlewares/authMiddleware');

const {
  createProject, getAllProjects, getMyProjects, getProjectById, deleteProject } = require('../controllers/projectController');


console.log({ createProject, getAllProjects, getProjectById }); // Debugging log


const router = express.Router();

router.post('/', protect, createProject); // Create a project
router.get('/', protect,getAllProjects); // Get all projects
router.get('/myprojects', protect, getMyProjects);
router.get('/:id', protect, getProjectById); // Get a project by ID
router.delete('/:id', protect, deleteProject);  // delete route

module.exports = router;
