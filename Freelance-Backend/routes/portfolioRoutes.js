const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { addPortfolioItem, getUserPortfolio, deletePortfolioItem, getUserPortfolioById } = require('../controllers/portfolioController');

const router = express.Router();

// Add a portfolio item
router.post('/', protect, upload.array('media', 5), addPortfolioItem);

// Get all portfolio items for a user
router.get('/', protect, getUserPortfolio);

// Delete a portfolio item
router.delete('/:id', protect, deletePortfolioItem);

// Get portfolio items for a specific user by ID
router.get('/user/:id/portfolios', protect, getUserPortfolioById);



module.exports = router;
