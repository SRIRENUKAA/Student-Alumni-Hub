import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import AlumniLogin from "./components/AlumniLogin";
import AlumniSignup from "./components/AlumniSignup";
import StudentDashboard from "./components/StudentDashboard";
import AlumniDashboard from "./components/AlumniDashboard";
import AlumniProfile from "./components/AlumniProfile";
import StudentProfile from "./components/StudentProfile";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path="/alumni-login" element={<AlumniLogin />} />
        <Route path="/alumni-signup" element={<AlumniSignup />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
        <Route path="/alumni-profile/:id" element={<AlumniProfile />} />
        <Route path="/student-profile" element={<StudentProfile />} />
      </Routes>
  );
}

export default App;
