const Student = require("../models/Student");
const Alumni = require("../models/Alumni");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Student Signup Controller
const signupStudent = async (req, res) => {
    try {
        let { email, password } = req.body;  

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        email = email.trim().toLowerCase();  // Trim spaces & convert to lowercase

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if email already exists in Student or Alumni collections
        const existingStudent = await Student.findOne({ email });
        const existingAlumni = await Alumni.findOne({ email });

        if (existingStudent || existingAlumni) {
            return res.status(400).json({ message: "Email already registered" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must have at least 6 characters" });
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save student to database
        const newStudent = new Student({ email, password: hashedPassword });
        await newStudent.save();

        res.status(201).json({ message: "Signup successful" });

    } catch (error) {
        console.error("🚨 Signup Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Student Login Controller
const loginStudent = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase(); 

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(400).json({ message: "Invalid user" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Use the secret key from the environment variable
        const token = jwt.sign({ userId: student._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.error("🚨 Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { signupStudent, loginStudent };
