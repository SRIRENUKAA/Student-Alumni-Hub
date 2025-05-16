import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../AlumniDashboard.css";
import AlumniProfile from "./AlumniProfile";

const AlumniDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [internships] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [setAlumniId] = useState(localStorage.getItem("alumniId"));

  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumniId = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/alumni/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem("alumniId", res.data._id);
        console.log("Alumni ID set at load:", res.data._id);
      } catch (err) {
        console.error("Error fetching alumni profile:", err);
      }
    };

    fetchAlumniId();
  }, []);

  // Fetch alumni profile
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/alumni/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { _id, profileImage: backendImage, name: backendName } = res.data;

      setAlumniId(_id);
      localStorage.setItem("alumniId", _id);

      if (!localStorage.getItem("profileImage")) {
        localStorage.setItem("profileImage", backendImage);
        setProfileImage(backendImage);
      }

      if (!localStorage.getItem("name")) {
        localStorage.setItem("name", backendName);
        setName(backendName);
      }
    } catch (err) {
      console.error("Error fetching alumni profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle internship post
  const handlePostInternship = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (!title || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/internships", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      setShowPostModal(false); // Close modal
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error posting internship:", error.response ? error.response.data : error.message);
      alert("Failed to post internship");
    }
  };

  // Effects
  useEffect(() => {
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleBack = (event) => {
      if (showProfile) {
        event.preventDefault();
        setShowProfile(false);
        navigate("/alumni-dashboard", { replace: true });
      }
    };
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [showProfile, navigate]);

  const handleProfileUpdate = (newProfileImage) => {
    localStorage.setItem("profileImage", newProfileImage);
    setProfileImage(newProfileImage);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Profile Icon */}
      {!showProfile && (
        <img
          src={profileImage || "https://via.placeholder.com/50"}
          alt="Profile"
          className="profile-icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <img
            src={profileImage || "https://via.placeholder.com/50"}
            alt="Profile"
            className="sidebar-profile-icon"
            onClick={() => {
              setShowProfile(true);
              setSidebarOpen(false);
            }}
          />
          <p>{name || "Your Name"}</p>
          <p>Saved Posts</p>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : showProfile ? (
          <AlumniProfile
            setProfileImage={handleProfileUpdate}
            setName={setName}
            setShowProfile={setShowProfile}
          />
        ) : (
          <div className="home-section">
            <div className="home-header">
              <h2>Internships</h2>
                <button className="post-button" onClick={() => setShowPostModal(true)}>
                  +
                </button>
            </div>

            <div className="posts-container">
              {internships.map((post, idx) => (
                <div className="post-card" key={idx}>
                  {post.image && <img src={post.image} alt="Internship" className="post-image" />}
                  <h4>{post.title}</h4>
                  <p>{post.description}</p>
                  <p className="posted-by">
                    Posted by: {post.alumniName || post.alumniId?.name || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Post Internship</h3>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div className="modal-actions">
              <button onClick={handlePostInternship}>Post</button>
              <button onClick={() => setShowPostModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDashboard;
