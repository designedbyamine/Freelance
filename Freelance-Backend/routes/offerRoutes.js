const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createOffer, getOffersByProject, updateOfferStatus, getFreelancerOffers, } = require('../controllers/offerController');

const router = express.Router();

// Create an offer
router.post('/', protect, createOffer);

// Get offers sent by the freelancer
router.get('/freelancer', protect, getFreelancerOffers);

// Get offers by project
router.get('/project/:projectId', protect, getOffersByProject);

// Accept/Reject an offer
router.put('/:offerId/status', protect, updateOfferStatus);

module.exports = router;
