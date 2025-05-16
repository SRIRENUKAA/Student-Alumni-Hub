import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../StudentDashboard.css";
import StudentProfile from "./StudentProfile";
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import {
  WhatsappShareButton,
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
} from 'react-share';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const sharePopupRefs = useRef({});
  const navigate = useNavigate();

  const alumniName = localStorage.getItem("name");
  const alumniProfileImage = localStorage.getItem("profileImage");
  const [profileImage] = useState(localStorage.getItem("studentProfileImage"));
  const [name] = useState(localStorage.getItem("studentName"));
  const [sharePopupVisible, setSharePopupVisible] = useState({});
  const [likedPosts, setLikedPosts] = useState({});

  // Like, Comment, Share
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [commentBoxVisible, setCommentBoxVisible] = useState({});
  const [showCommentBox] = useState({});
  const [newComment, setNewComment] = useState({});
  
  const handleLike = async (id) => {
    try {
      // optional: userId only if you use it in backend
      let userId = localStorage.getItem("userId") || "guest";
  
      const res = await axios.put(`/api/internships/${id}/like`, {
        userId,
        liked: !likedPosts[id], // 👈 tell backend if we're liking or unliking
      });
  
      setLikedPosts((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
  
      setLikes((prev) => ({
        ...prev,
        [id]: res.data.likes,
      }));
    } catch (error) {
      console.error("Error liking internship:", error);
    }
  };
                
  const toggleComment = async (id) => {
    // Toggle the visibility of the comment box
    setCommentBoxVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  
    // If comment box is opening, fetch the comments for the job
    if (!commentBoxVisible[id]) {
      await fetchCommentsForJob(id); // Fetch existing comments for this job
    }
  };
  
  const fetchCommentsForJob = async (id) => {
    try {
      const res = await axios.get(`/api/internships/${id}/comments`);
      // Store the comments in the state
      setComments((prev) => ({
        ...prev,
        [id]: res.data.comments || [], // Assuming the backend returns an array of comments
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  
  const handleCommentChange = (id, value) => {
    setComments((prev) => ({
      ...prev,
      [id]: value, // Update the comment for this particular job
    }));
  };
  
  const postComment = async (id) => {
    try {
      const newComment = comments[id];
      if (!newComment.trim()) return; // Don't post empty comments
  
      // Post the comment to the backend
      await axios.post("/api/internships/comment", {
        internshipId: id,
        comment: newComment,
      });
  
      // Update the state by adding the new comment to the list of comments
      setComments((prev) => ({
        ...prev,
        [id]: "", // Clear the input after posting
      }));
  
      // Fetch the updated comments list after posting
      await fetchCommentsForJob(id);
  
      setCommentBoxVisible((prev) => ({ ...prev, [id]: false })); // Close the comment box after posting
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleCommentSubmit = (jobId) => {
    const comment = newComment[jobId];
  
    if (!comment?.trim()) return;
  
    // Save new comment to backend or local state
    setComments((prev) => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), comment],
    }));
  
    setNewComment((prev) => ({
      ...prev,
      [jobId]: '',
    }));
  };  

  useEffect(() => {
    fetchStudentProfile();
    fetchOpportunities();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const res = await axios.get("/api/student/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStudent(res.data);
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const res = await axios.get("/api/internships/opportunities");
      setOpportunities(res.data);
      const initialLikes = {};
      res.data.forEach((job) => {
        initialLikes[job._id] = job.likes || 0;
      });
      setLikes(initialLikes);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    }
  };

  useEffect(() => {
      const handleBack = (event) => {
        if (showProfile) {
          event.preventDefault();
          setShowProfile(false);
          navigate("/student-dashboard", { replace: true });
        }
      };
      window.history.pushState(null, "", window.location.pathname);
      window.addEventListener("popstate", handleBack);
      return () => window.removeEventListener("popstate", handleBack);
    }, [showProfile, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
  
      let clickedInsidePopup = false;
      Object.values(sharePopupRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target)) {
          clickedInsidePopup = true;
        }
      });
  
      if (!clickedInsidePopup) {
        setSharePopupVisible({});
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);  

  return (
    <div className="dashboard-container">
      {!showProfile && (
        <img
          src={profileImage || "https://via.placeholder.com/50"}
          alt="Profile"
          className="profile-icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {!showProfile && (
        <div
          ref={sidebarRef}
          className={`sidebar ${sidebarOpen ? "open" : ""}`}
        >
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
            <p>{student?.email || "your.email@example.com"}</p>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="main-content">
        {showProfile ? (
          <StudentProfile
            setShowProfile={setShowProfile}
            setStudent={setStudent}
          />
        ) : (
          <>
            {opportunities.map((job) => (
              <div key={job._id} className="job-card">
              {job.alumniId && (
                <div className="alumni-info">
                    <Link to={`/alumni-profile/${job.alumniId._id}`}>
                      <img
                        src={alumniProfileImage || "https://via.placeholder.com/150"}
                        alt="Alumni Profile"
                        className="alumni-profile-img"
                        style={{ cursor: "pointer" }}
                      />
                    </Link>
                  <div className="alumni-details">
                    <h3>{alumniName || "Alumni Name"}</h3>
                    <div className="posted-date">
                      Posted on{" "}
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
                {job.image && (
                  <img
                    src={job.image}
                    alt="Internship"
                    className="internship-img"
                  />
                )}
                <p>{job.description}</p>

                  {/* 🔹 Like / Comment / Share Icons */}
                  <div className="post-actions">
                  <span
                    className="action-icon"
                    onClick={() => handleLike(job._id)}
                  >
                    <ThumbsUp
                      size={20}
                      strokeWidth={2}
                      style={{ color: likedPosts[job._id] ? "#007bff" : "black" }} // icon color only
                    />
                    <span style={{ marginLeft: "6px", color: "#333" }}>
                      {likes[job._id] || 0}
                    </span>
                  </span>
                  <span className="action-icon" onClick={() => toggleComment(job._id)}>
                    <MessageCircle size={20} />
                  </span>
                  {/* Show comment box only for the selected job */}
                  {showCommentBox[job._id] && (
                    <div className="comment-section">
                      <input
                        type="text"
                        placeholder="Write a comment"
                        value={newComment[job._id] || ''}
                        onChange={(e) => handleCommentChange(e, job._id)}
                      />
                      <button onClick={() => handleCommentSubmit(job._id)}>Post</button>

                      {/* Show comments for this job */}
                      <div className="comments-list">
                        {(comments[job._id] || []).map((comment, index) => (
                          <div key={index}>{comment}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  <span className="action-icon" onClick={() => {
                    setSharePopupVisible(prev => ({
                      ...prev,
                      [job._id]: !prev[job._id],
                    }));
                  }}>
                    <Share2 size={20} />
                  </span>

                  {sharePopupVisible[job._id] && (
                  <div className="share-popup"
                  ref={(el) => {
                    if (el) {
                      sharePopupRefs.current[job._id] = el;
                    }
                  }}
                  >
                    <WhatsappShareButton url={`https://your-site.com/internship/${job._id}`} title={job.title}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <TwitterShareButton url={`https://your-site.com/internship/${job._id}`} title={job.title}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <FacebookShareButton url={`https://your-site.com/internship/${job._id}`} quote={job.title}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <LinkedinShareButton url={`https://your-site.com/internship/${job._id}`} title={job.title}>
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <div className="share-option" style={{ marginTop: '8px' }}>
                    <details>
                      <summary style={{ cursor: 'pointer' }}>⋯</summary>
                      <ul>
                        <li><a href={`mailto:?subject=Internship&body=Check this out: https://your-site.com/internship/${job._id}`}>✉️ Email</a></li>
                        <li><a href={`https://www.reddit.com/submit?url=https://your-site.com/internship/${job._id}`} target="_blank" rel="noreferrer">👽 Reddit</a></li>
                        <li onClick={() => {
                          navigator.clipboard.writeText(`https://your-site.com/internship/${job._id}`);
                          alert("Link copied!");
                        }} style={{ cursor: 'pointer' }}>🔗 Copy</li>
                      </ul>
                    </details>
                  </div>
                  </div>
                )}
                </div>

                {commentBoxVisible[job._id] && (
                  <div className="comment-box">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={comments[job._id] || ""}
                      onChange={(e) =>
                        handleCommentChange(job._id, e.target.value)
                      }
                    />
                    <button onClick={() => postComment(job._id)}>Post</button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
