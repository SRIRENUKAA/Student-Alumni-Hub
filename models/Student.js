const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);
