import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaCamera, FaSave, FaTimes } from "react-icons/fa";
import "../AlumniProfile.css";
import {
  FaUser, FaInfoCircle, FaBuilding, FaBriefcase,
  FaTools, FaGraduationCap, FaBookOpen, FaGlobe, FaEnvelope, FaCalendarAlt,
} from "react-icons/fa";

const AlumniProfile = ({ setProfileImage, setName }) => {
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("alumniProfileImage") || "https://via.placeholder.com/150"
  );  
  const [name, setLocalName] = useState(localStorage.getItem("name") || "Your Name");
  const [bio, setBio] = useState(localStorage.getItem("bio") || "Add a short bio...");
  const [company, setCompany] = useState(localStorage.getItem("company") || "Current Company");
  const [jobTitle, setJobTitle] = useState(localStorage.getItem("jobTitle") || "Your Job Title");
  const [skills, setSkills] = useState(localStorage.getItem("skills") || "");
  const [education, setEducation] = useState(localStorage.getItem("education") || "");
  const [workExperience, setWorkExperience] = useState(localStorage.getItem("workExperience") || "");
  const [socialLink, setSocialLink] = useState(localStorage.getItem("socialLink") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [passoutYear, setPassoutYear] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (setProfileImage) setProfileImage(profileImg);
    if (setName) setName(name);
  
    if (isEditing) {
      document.body.classList.add("edit-active");
    } else {
      document.body.classList.remove("edit-active");
    }
  }, [profileImg, name, setProfileImage, setName, isEditing]);
  
  const { id } = useParams();
  const [, setAlumni] = useState(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/alumni/${id}`);
        const alumniData = response.data;
        setAlumni(alumniData);

        // If viewing someone else's profile (student view), update state with fetched data
        if (alumniData) {
          setProfileImg(alumniData.profileImage || "https://via.placeholder.com/150");
          setLocalName(alumniData.name || "Your Name");
          setBio(alumniData.bio || "Add a short bio...");
          setCompany(alumniData.company || "Current Company");
          setJobTitle(alumniData.jobTitle || "Your Job Title");
          setSkills(alumniData.skills || "");
          setEducation(alumniData.education || "");
          setWorkExperience(alumniData.workExperience || "");
          setSocialLink(alumniData.socialLink || "");
          setEmail(alumniData.email || "");
          setPassoutYear(alumniData.passoutYear || "");
        }
      } catch (err) {
        console.error("Error fetching alumni:", err);
      }
    };

    fetchAlumni();
  }, [id]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result); // ✅ This must be defined as shown above
        localStorage.setItem("alumniProfileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    localStorage.setItem("name", name);
    localStorage.setItem("bio", bio);
    localStorage.setItem("company", company);
    localStorage.setItem("jobTitle", jobTitle);
    localStorage.setItem("skills", skills);
    localStorage.setItem("education", education);
    localStorage.setItem("workExperience", workExperience);
    localStorage.setItem("socialLink", socialLink);
    localStorage.setItem("email", email);
    localStorage.setItem("passoutYear", passoutYear);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsClosing(true); // Trigger the closing animation
    setTimeout(() => {
      setIsEditing(false); // Close the modal after the animation ends
      setIsClosing(false); // Reset the closing state
    }, 400); // Match the animation duration
  };  

  return (
  <>
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-img-container">
          <img src={profileImg} alt="Profile" className="profile-img" />
          <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
            <FaCamera />
          </button>
        </div>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} hidden />
      </div>

      <div className="profile-stats">
        <div><h3>10</h3><p>Posts</p></div>
        <div><h3>250</h3><p>Followers</p></div>
        <div><h3>180</h3><p>Following</p></div>
      </div>

      <button onClick={() => setIsEditing(true)} className="edit-button full-width">Edit Profile</button>

      {/* Display updated name and bio here */}
      <div className="profile-summary">
        <div className="summary-item">
          <FaUser className="summary-icon" />
          <h3>{name}</h3>
        </div>
        <div className="summary-item">
          <FaInfoCircle className="summary-icon" />
          <p>{bio}</p>
        </div>
        <div className="summary-item">
          <FaEnvelope className="summary-icon" />
          <p>{email}</p>
        </div>
        <div className="summary-item">
          <FaBuilding className="summary-icon" />
          <p>{company}</p>
        </div>
        <div className="summary-item">
          <FaBriefcase className="summary-icon" />
          <p>{jobTitle}</p>
        </div>
        <div className="summary-item">
          <FaTools className="summary-icon" />
          <p>{skills}</p>
        </div>
        <div className="summary-item">
          <FaBookOpen className="summary-icon" />
          <p>{workExperience}</p>
        </div>
        <div className="summary-item">
          <FaGlobe className="summary-icon" />
          <p>{socialLink}</p>
        </div>
        <div className="summary-item">
          <FaGraduationCap className="summary-icon" />
          <p>{education}</p>
        </div>
        <div className="summary-item">
          <FaCalendarAlt className="summary-icon" />
          <p>{passoutYear}</p>
        </div>
      </div>

      {isEditing && (
        <>
          <div className="blur-layer"></div>
          <div className={`edit-modal ${isClosing ? 'closing' : ''}`}>
            <div className="edit-form">
              <h2>Edit Profile</h2>

              <div className="input-block">
                <div className="label-with-icon">
                  <FaUser className="icon" />
                  <label>Name</label>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setLocalName(e.target.value)}
                />
              </div>

              <div className="input-block">
                <div className="label-with-icon">
                  <FaBuilding className="icon" />
                  <label>Company</label>
                </div>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="input-block">
                <div className="label-with-icon">
                  <FaBriefcase className="icon" />
                  <label>Job Title</label>
                </div>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="input-block">
                <div className="label-with-icon">
                  <FaTools className="icon" />
                  <label>Skills</label>
                </div>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="input-block">
                <div className="label-with-icon">
                  <FaGraduationCap className="icon" />
                  <label>Education</label>
                </div>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>

              <div className="input-block">
                <div className="label-with-icon">
                  <FaGlobe className="icon" />
                  <label>Social Media Link</label>
                </div>
                <input
                  type="text"
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                />
              </div>

              <div className="input-block">
                <div className="label-with-icon">
                  <FaEnvelope className="icon" />
                  <label>Email</label>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-block">
                <div className="label-with-icon">
                  <FaCalendarAlt className="icon" />
                  <label>Passout Year</label>
                </div>
                <input
                  type="number"
                  value={passoutYear}
                  onChange={(e) => setPassoutYear(e.target.value)}
                />
              </div>

              <div className="input-block">
                <div className="label-with-icon">
                  <FaInfoCircle className="icon" />
                  <label>Bio</label>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="input-block">
                <div className="label-with-icon">
                  <FaBookOpen className="icon" />
                  <label>Work Experience</label>
                </div>
                <textarea
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                />
              </div>

              <div className="button-group">
                <button onClick={handleSave} className="save-button">
                  <FaSave /> Save
                </button>
                <button onClick={handleCancel} className="cancel-button">
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </>
  );
};

export default AlumniProfile;
