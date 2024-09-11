// server.js
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON requests
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});