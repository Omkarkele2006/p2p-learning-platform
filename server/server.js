require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Add this for Day 2
const resourceRoutes = require('./routes/resourceRoutes');
const discussionRoutes = require('./routes/discussionRoutes');

connectDB();
const app = express();

// --- MIDDLEWARE (MUST BE HERE) ---
app.use(cors());
app.use(express.json());  // <--- THIS LINE FIXES YOUR ERROR
// ---------------------------------

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/discussions', discussionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));