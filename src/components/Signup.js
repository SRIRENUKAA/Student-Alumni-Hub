import React, { useState } from "react";
import axios from "axios";

export default function Signup({ userType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/auth/register`, { email, password, userType });
      alert("Signup Successful! Please login.");
      window.location.href = `/${userType}-login`;
    } catch (err) {
      alert("Signup Failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>{userType === "student" ? "Student" : "Alumni"} Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

const styles = { container: { textAlign: "center", padding: "50px" } };
