import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Login({ userType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Check if user is already logged in (to prevent logout on refresh)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/alumni-dashboard"; // Redirect if already logged in
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/api/alumni/login", {
        email,
        password,
      });
  
      const data = response.data;
  
      // ✅ Store only if it's available
      if (data.user.profileImage) {
        localStorage.setItem("profileImage", data.user.profileImage);
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("bio", data.user.bio);
      localStorage.setItem("socialLink", data.user.socialLink);
  
      window.location.href = "/alumni-dashboard"; // Redirect
    } catch (error) {
      console.error("🚨 Login Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Login failed, try again.");
    }
  };  

  return (
    <div style={styles.container}>
      <h2>{userType === "student" ? "Student" : "Alumni"} Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

const styles = { container: { textAlign: "center", padding: "50px" } };
