const Offer = require('../models/Offer');
const Project = require('../models/Project');
const User = require('../models/User');
const sendEmail = require('../utils/emailService'); // Assuming you have a function to send emails

// Create an Offer
const createOffer = async (req, res) => {
  try {
    const { projectId, bidAmount, estimatedTime, message } = req.body;

    // Ensure the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create the offer
    const offer = new Offer({
      projectId,
      freelancerId: req.user.id, // Freelancer making the offer
      bidAmount,
      estimatedTime,
      message,
    });
    await offer.save();

    // Notify the client
    const client = await User.findById(project.clientId);
    if (client) {
      const emailContent = `
        <h1>New Offer on Your Project</h1>
        <p>Freelancer ${req.user.name} has made an offer on your project "${project.title}".</p>
        <p>Rate: $${bidAmount}</p>
        <p>Time Estimate: ${estimatedTime}</p>
        <a href="http://localhost:3000/projects/${projectId}/offers">View Offers</a>
      `;
      await sendEmail(client.email, 'New Offer on Your Project', emailContent);
    }

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Offers by Project
const getOffersByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Fetch offers for the project
    const offers = await Offer.find({ projectId }).populate('freelancerId', 'name email');

    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept or Reject Offer
const updateOfferStatus = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the offer
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Ensure only the project owner can update the offer status
    const project = await Project.findById(offer.projectId);
    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update the offer status
    offer.status = status;
    await offer.save();

    if (status === 'accepted') {
      // Associate the freelancer with the project
      project.selectedFreelancer = offer.freelancerId;
      await project.save();

      // Notify the freelancer
      const freelancer = await User.findById(offer.freelancerId);
      if (freelancer) {
        const emailContent = `
          <h1>Congratulations!</h1>
          <p>Your offer for the project "${project.title}" has been accepted.</p>
          <a href="http://localhost:3000/projects/${project._id}">View Project</a>
        `;
        await sendEmail(freelancer.email, 'Offer Accepted', emailContent);
      }
    }

    res.status(200).json({ message: `Offer ${status} successfully`, offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFreelancerOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ freelancerId: req.user.id })
      .populate('projectId', 'title description')
      .sort({ createdAt: -1 }); // Sort by the most recent offers

    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createOffer,
  getOffersByProject,
  updateOfferStatus,
  getFreelancerOffers,
};
