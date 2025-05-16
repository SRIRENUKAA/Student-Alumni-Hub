import React, { useState } from "react";
import axios from "axios";
import "../auth.css";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error message

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before new request

    try {
      const res = await axios.post("http://localhost:5000/api/student/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/student-dashboard";
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("User not found. Please sign up.");
      } else {
        setError("Invalid Credentials. Please try again.");
      }
    }
  };

  return (
    <div className="container">
      <div className="auth-box">
        <h2>Student Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className={error ? "input-error" : ""}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className={error ? "input-error" : ""}
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="/student-signup">Signup</a>
        </p>
      </div>
    </div>
  );
}
