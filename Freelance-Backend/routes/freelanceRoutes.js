const express = require('express');
const { updateFreelancerProfile, searchFreelancers, getFreelancerProfile } = require('../controllers/freelanceController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Path to your upload middleware

const router = express.Router();

// Update freelancer profile
router.put('/profile', upload.single('photo'), protect, updateFreelancerProfile);
// Route for searching freelancers based on filters
router.get('/search', protect,searchFreelancers);
//get connected freelancer profile
router.get('/myprofile', protect, getFreelancerProfile);


module.exports = router;
