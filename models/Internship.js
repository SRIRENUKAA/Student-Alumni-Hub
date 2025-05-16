const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  alumniName: String,
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni", // ✅ Must match your Alumni model name
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Internship", InternshipSchema);
