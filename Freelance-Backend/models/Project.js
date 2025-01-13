const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    skillsRequired: {
      type: [String], // Array
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'in progress', 'completed', 'closed'],
      default: 'open',
    },
    selectedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      default: null, // Initially no freelancer selected
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
