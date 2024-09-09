const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const router = express.Router();

// POST /api/students/signup - Signup route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new student
        const newStudent = new Student({
            name,
            email,
            password: hashedPassword,
        });

        // Save to database
        const savedStudent = await newStudent.save();

        // Generate JWT token (optional)
        const token = jwt.sign({ id: savedStudent._id }, 'your_jwt_secret_key', {
            expiresIn: 3600, // 1 hour
        });

        res.json({
            token,
            student: {
                id: savedStudent._id,
                name: savedStudent.name,
                email: savedStudent.email,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;