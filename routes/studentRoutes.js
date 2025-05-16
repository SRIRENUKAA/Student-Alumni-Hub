const express = require("express");
const router = express.Router();
const { signupStudent, loginStudent } = require("../controllers/studentController");

// Define Signup Route
router.post("/signup", signupStudent);
router.post("/login", loginStudent);

module.exports = router;
