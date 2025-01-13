const User = require('../models/User');

const updateFreelancerProfile = async (req, res) => {
    try {
      const {
        description,
        skills,
        experience,
        experienceLevel,
        education,
        languages,
        location,
        hourlyRate,
        category,
      } = req.body;
  
      let photoUrl = null;
  
      // If a new photo file is uploaded, get the URL
      if (req.file) {
        // Assuming photos are stored in 'uploads/photos'
        photoUrl = `/uploads/${req.file.filename}`;
      }
  
      // Create an object with the updated profile fields
      const updatedProfile = {
        'profile.description': description,
        'profile.skills': skills,
        'profile.experience': experience,
        'profile.experienceLevel': experienceLevel,
        'profile.education': education,
        'profile.languages': languages,
        'profile.location': location,
        'profile.hourlyRate': hourlyRate,
        'profile.category': category,
      };
  
      // Add the photo URL if it's present
      if (photoUrl) {
        updatedProfile['profile.photo'] = photoUrl;
      }
  
      // Update the freelancer's profile in the database
      const user = await User.findByIdAndUpdate(req.user.id, updatedProfile, { new: true });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send the updated user profile back as the response
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Search for freelancers based on filters
const searchFreelancers = async (req, res) => {
  try {
    const { skills, rating, experienceLevel, location, hourlyRate, category } = req.query;

    const filters = {};

    if (skills) {
      const skillArray = skills.split(',').map(skill => skill.trim());
      filters['profile.skills'] = { 
        $elemMatch: { $regex: new RegExp(skillArray.join('|'), 'i') } 
      }; // Match any skill using regex
    }
    if (rating) {
      filters['profile.rating'] = { $gte: rating }; 
    }
    if (experienceLevel) {
      filters['profile.experienceLevel'] = experienceLevel;
    }
    if (location) {
      filters['profile.location'] = location;
    }
    if (hourlyRate) {
      filters['profile.hourlyRate'] = { $eq: hourlyRate }; // $lte = Hourly rate should be less than or equal to the specified value
    }
    if (category) {
      const categoryArray = category.split(',').map(cat => cat.trim());
      filters['profile.category'] = { 
        $elemMatch: { $regex: new RegExp(categoryArray.join('|'), 'i') } 
      }; // Match any category
    }

    const freelancers = await User.find({ role: 'freelancer', ...filters });

    if (freelancers.length === 0) {
      return res.status(404).json({ message: "No freelancers found matching the criteria." });
    }

    res.status(200).json(freelancers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get freelancer's profile
const getFreelancerProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (!user || user.role !== 'freelancer') {
        return res.status(404).json({ message: 'Freelancer not found' });
      }
  
      // Check if the photo exists and prepend the base URL
      if (user.profile && user.profile.photo) {
        user.profile.photo = `http://127.0.0.1:3000${user.profile.photo}`;
      }
  
      res.status(200).json(user.profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = {
  updateFreelancerProfile,
  searchFreelancers,
  getFreelancerProfile,
};
