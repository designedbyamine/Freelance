const User = require('../models/User');

// Update client profile
const updateClientProfile = async (req, res) => {
  try {
    const { companyName, industry, paymentMethods } = req.body;

    let photoUrl = null;

    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }

    // Create an object with the updated profile fields
    const updateData = {
      'profile.companyName': companyName,
      'profile.industry': industry,
      'profile.paymentMethods': paymentMethods,
    };

    // Add the photo URL if it's present
    if (photoUrl) {
      updateData['profile.photo'] = photoUrl;
    }

    // update
    const client = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: updateData },
      { new: true } // Return the updated user
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getClientProfile = async (req, res) => {
  try {
    const client = await User.findById(req.user.id); // authenticated user's data

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Return only the profile object from the client data
    res.status(200).json(client.profile); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateClientProfile, getClientProfile };
