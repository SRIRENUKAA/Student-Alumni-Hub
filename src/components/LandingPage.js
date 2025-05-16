import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

function LandingPage() {
  return (
    <div className="container">
      <h1>Welcome to Student-Alumni Portal</h1>
      <div className="button-container">
        <Link to="/student-login">
          <button>Student Login</button>
        </Link>
        <Link to="/alumni-login">
          <button>Alumni Login</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
