const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


app.use("/uploads", express.static("uploads"));
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.get("/", (req, res)=>{
    res.send("API is running...");
});

// Use student routes
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/student", studentRoutes);

// Use alumni routes
const alumniRoutes = require("./routes/alumniRoutes");
app.use("/api/alumni", alumniRoutes);

const internshipRoutes = require("./routes/internshipRoutes");
app.use("/api/internships", internshipRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
