require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors()); // Enable CORS
app.use(apiLimiter); // Apply general API rate limiting

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', authLimiter, require('./routes/auth')); // Apply auth rate limiting
app.use('/api/requests', require('./routes/plateRequests')); // Add plate requests routes
app.use('/api/profile', require('./routes/profile')); // Add profile routes
app.use('/uploads', express.static('uploads')); // Serve static uploaded files

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));