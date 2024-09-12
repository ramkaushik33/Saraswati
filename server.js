// server.js
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const cors = require('cors');

// Initialize express app
const app = express();

app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON requests
app.use(express.json());

// Routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});