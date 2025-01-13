const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./utils/errorHandler');
const portfolioRoutes = require('./routes/portfolioRoutes');
const projectRoutes = require('./routes/projectRoutes'); 
const offerRoutes = require('./routes/offerRoutes');
const freelanceRoutes = require('./routes/freelanceRoutes');
const clientRoutes = require('./routes/clientRoutes');
const cors = require('cors');
const path = require('path');



dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/projects', projectRoutes);
app.use('/api/offers', offerRoutes);

app.use('/api/freelancer', freelanceRoutes);
app.use('/api/client', clientRoutes);





app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
