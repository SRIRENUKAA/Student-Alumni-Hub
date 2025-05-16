const express = require("express");
const {
  signupAlumni,
  loginAlumni,
  logoutAlumni,
  getAlumniProfile,
  updateAlumniProfile,
} = require("../controllers/alumniController");

const authMiddleware = require("../middleware/authMiddleware"); // Authentication middleware

const router = express.Router();

router.post("/signup", signupAlumni); // Register alumni
router.post("/login", loginAlumni); // Login alumni
router.post("/logout", authMiddleware, logoutAlumni); // Logout alumni
router.get("/profile", authMiddleware, getAlumniProfile); // Fetch profile
router.put("/profile/update", authMiddleware, updateAlumniProfile); // Update profile

module.exports = router;
