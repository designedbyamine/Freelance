const Portfolio = require('../models/Portfolio');

const addPortfolioItem = async (req, res) => {
    try {
        const { title, description, skills } = req.body;
        const userId = req.user.id;
        const mediaFiles = req.files.map(file => file.path); // Paths of uploaded media

        const portfolioItem = new Portfolio({
            userId,
            title,
            description,
            media: mediaFiles,
            skills,
        });

        await portfolioItem.save();
        res.status(201).json(portfolioItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get portfolio items for the logged-in user
const getUserPortfolio = async (req, res) => {
    try {
        const userId = req.user.id;
        const portfolioItems = await Portfolio.find({ userId });
        res.status(200).json(portfolioItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get portfolio items for a specific user
const getUserPortfolioById = async (req, res) => {
    try {
        const { id } = req.params; // user ID from the route parameters
        const portfolioItems = await Portfolio.find({ userId: id });

        if (!portfolioItems.length) {
            return res.status(404).json({ message: 'No portfolios found for this user' });
        }

        res.status(200).json(portfolioItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePortfolioItem = async (req, res) => {
    try {
        const { id } = req.params;
        const portfolioItem = await Portfolio.findById(id);

        if (!portfolioItem) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }

        // Ensure the logged-in user is the owner of the item
        if (portfolioItem.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this item' });
        }

        await Portfolio.findByIdAndDelete(id);
        res.status(200).json({ message: 'Portfolio item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addPortfolioItem,
    getUserPortfolio,
    getUserPortfolioById,   
    deletePortfolioItem,
};
