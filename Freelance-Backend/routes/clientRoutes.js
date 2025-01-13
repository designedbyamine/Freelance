const express = require('express');
const { updateClientProfile, getClientProfile } = require('../controllers/clientController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); 
const router = express.Router();

// Update client profile
router.put('/profile', upload.single('photo'), protect, updateClientProfile);

// Get Client Profile
router.get('/myprofile', protect, getClientProfile);


module.exports = router;
