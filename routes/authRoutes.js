// routes/authRoutes.js
const express = require("express");
const { signup, login, getUserProfile } = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getUserProfile);

module.exports = router;