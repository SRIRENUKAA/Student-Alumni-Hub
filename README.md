<h1 align="center">🎓 Student-Alumni Hub</h1>

### 👋 Hi, I'm Sri Renuka  
A passionate frontend developer from India 🇮🇳  

This is a **Student-Alumni Connection Portal** built using the MERN stack to connect students with alumni for guidance, opportunities, and mentoring.

---

### 🚀 Features

- 🔐 Role-based login for Students and Alumni
- 🧑‍🎓 Student Dashboard
  - Profile creation & editing
  - View internships & jobs posted by alumni
  - Apply for opportunities
  - Chat with alumni
- 🧑‍💼 Alumni Dashboard
  - Create and update profile
  - Post internships/jobs with images and descriptions
  - View student applicants
  - Chat with students and other alumni
- 💬 Real-time comments & emoji support
- 🖼️ Profile view with image upload
- 📦 JWT Authentication + MongoDB storage

---

### 🧰 Tech Stack

- **Frontend:** React, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT + bcrypt
- **Styling:** Custom CSS (No Tailwind)
- **Deployment:** Coming Soon

---

### 📁 Folder Structure

```bash
Student-Alumni-Hub/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Authentication middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routes
│   ├── server.js             # Entry point
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/                  # React source files
│   │   ├── components/       # Components (Dashboards, Profiles, etc.)
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── README.md                 # Project documentation
