const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Internship = require("../models/Internship");
const verifyToken = require("../middleware/authMiddleware");

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ✅ Folder must exist
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ✅ GET all internship opportunities
router.get("/opportunities", async (req, res) => {
  try {
    const internships = await Internship.find()
      .sort({ createdAt: -1 }) // optional: newest first
      .populate("postedBy", "name profileImage"); // ✅ make sure 'profileImage' is in Alumni schema

    res.json(internships);
  } catch (err) {
    console.error("Error fetching internships:", err);
    res.status(500).json({ message: "Failed to fetch internships" });
  }
});

// ✅ POST internship
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const newInternship = new Internship({
      title,
      description,
      image,
      postedBy: req.user.id, // ✅ Fixed: Get alumni ID from token
    });

    await newInternship.save();

    res.status(201).json({ message: "Internship posted successfully", newInternship });
  } catch (err) {
    console.error("Error posting internship:", err);
    res.status(500).json({ message: "Failed to post internship" });
  }
});

// PUT /api/internships/:id/like
router.put("/:id/like", async (req, res) => {
  try {
    const { userId, liked } = req.body;
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    // Like or Unlike logic
    if (liked) {
      // Add userId if not already liked
      if (!internship.likedBy.includes(userId)) {
        internship.likes += 1;
        internship.likedBy.push(userId);
      }
    } else {
      // Remove like
      if (internship.likedBy.includes(userId)) {
        internship.likes -= 1;
        internship.likedBy = internship.likedBy.filter((id) => id !== userId);
      }
    }

    await internship.save();

    res.status(200).json({ likes: internship.likes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;