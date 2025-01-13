const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['freelancer', 'client'], required: true },
    profile: {
      photo: { type: String }, // URL or path to profile photo
      description: { type: String }, // Common field
      skills: [{ type: String }], // Freelancer-specific
      experience: { type: String }, // Freelancer-specific
      experienceLevel: { type: String, enum: ['Junior', 'Mid', 'Senior'] },
      education: { type: String }, // Freelancer-specific
      languages: [{ type: String }], // Freelancer-specific
      location: { type: String }, // Freelancer location
      hourlyRate: { type: Number }, // Freelancer hourly rate
      category: [{ type: String, enum: ['Development', 'Design', 'Marketing', 'Writing', 'Consulting'] }], // Freelancer category (multi-select)
      companyName: { type: String }, // Client-specific
      industry: { type: String }, // Client-specific
      paymentMethods: [{ type: String }], // Client-specific
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
