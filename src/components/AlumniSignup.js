import React, { useState } from "react";
import "../auth.css";

export default function AlumniSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/alumni/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Alumni signup successful!");
      } else {
        alert(data.message || "Signup failed!");
      }
    } catch (error) {
      alert("Error connecting to server!");
    }
  };

  return (
    <div className="container">
      <div className="auth-box">
        <h2>Alumni Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Signup</button>
        </form>
        <p>
          Already have an account? <a href="/alumni-login">Login</a>
        </p>
      </div>
    </div>
  );
}
