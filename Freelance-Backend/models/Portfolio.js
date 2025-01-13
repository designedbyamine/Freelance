const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        media: {
            type: [String], // Array
            required: true,
        },
        skills: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
