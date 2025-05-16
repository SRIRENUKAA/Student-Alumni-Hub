const mongoose = require("mongoose");

const AlumniSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "https://via.placeholder.com/150" },
    bio: { type: String, default: "Add a short bio..." },
    socialLink: { type: String, default: "" },

    // New fields
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    posts: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model("Alumni", AlumniSchema);
