// server.js
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

// Initialize express app
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow only requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  credentials: true, // Allow credentials (optional, if you use cookies)
}));

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON requests
app.use(express.json());

// Routes
app.use("/", authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});