const Alumni = require("../models/Alumni");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Alumni Signup
const signupAlumni = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        email = email.trim().toLowerCase();

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save alumni to database
        const newAlumni = new Alumni({ email, password: hashedPassword });
        await newAlumni.save();

        res.status(201).json({ message: "Signup successful" });

    } catch (error) {
        console.error("🚨 Alumni Signup Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Alumni Login
const loginAlumni = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim().toLowerCase();

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const alumni = await Alumni.findOne({ email });
        if (!alumni) {
            return res.status(400).json({ message: "Invalid user" });
        }

        const isMatch = await bcrypt.compare(password, alumni.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: alumni._id, role: "alumni" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                email: alumni.email,
                name: alumni.name || "Your Name",
                profileImage: alumni.profileImage || "https://via.placeholder.com/150",
                bio: alumni.bio || "Add a short bio...",
                socialLink: alumni.socialLink || ""
            }
        });
    } catch (error) {
        console.error("🚨 Alumni Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Logout Alumni
const logoutAlumni = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get Alumni Profile
const getAlumniProfile = async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.user.id).select("-password");
        if (!alumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }

        res.json({
            _id: alumni._id, // ✅ Make sure this line exists!
            name: alumni.name,
            profileImage: alumni.profileImage,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Update Alumni Profile
const updateAlumniProfile = async (req, res) => {
    try {
        const { name, profileImage, bio, socialLink } = req.body;
        const updatedData = {};

        if (name) updatedData.name = name;
        if (profileImage) updatedData.profileImage = profileImage;
        if (bio) updatedData.bio = bio;
        if (socialLink) updatedData.socialLink = socialLink;

        const updatedAlumni = await Alumni.findByIdAndUpdate(
            req.user.userId,
            updatedData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedAlumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }

        res.json({ message: "Profile updated", alumni: updatedAlumni });
    } catch (error) {
        console.error("🚨 Update Profile Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { signupAlumni, loginAlumni, logoutAlumni, getAlumniProfile, updateAlumniProfile };
