import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setUpdatedUser(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/profile", updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(updatedUser);
      setEditMode(false);
      alert("Profile Updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{editMode ? "Edit Profile" : "My Profile"}</h2>
        {editMode ? (
          <div>
            <input type="text" name="name" value={updatedUser.name} onChange={handleChange} />
            <input type="email" name="email" value={updatedUser.email} disabled />
            <input type="text" name="bio" value={updatedUser.bio} onChange={handleChange} />
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Bio:</strong> {user.bio}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
  card: { padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px #ddd", textAlign: "center" },
};
