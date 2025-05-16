import { useState, useRef, useEffect } from "react";
import { FaCamera, FaSave, FaTimes, FaUser, FaInfoCircle, FaEnvelope, FaTools, FaGraduationCap, FaBookOpen, FaGlobe, FaCalendarAlt } from "react-icons/fa";
import "../AlumniProfile.css"; // reuse same styling

const StudentProfile = () => {
  const [profileImg, setProfileImg] = useState(
    localStorage.getItem("studentProfileImage") || "https://via.placeholder.com/150"
  );
  const [name, setName] = useState(localStorage.getItem("studentName") || "Student Name");
  const [bio, setBio] = useState(localStorage.getItem("studentBio") || "Add a short bio...");
  const [email, setEmail] = useState(localStorage.getItem("studentEmail") || "");
  const [skills, setSkills] = useState(localStorage.getItem("studentSkills") || "");
  const [education, setEducation] = useState(localStorage.getItem("studentEducation") || "");
  const [socialLink, setSocialLink] = useState(localStorage.getItem("studentSocialLink") || "");
  const [passoutYear, setPassoutYear] = useState(localStorage.getItem("studentPassoutYear") || "");
  const [workExperience, setWorkExperience] = useState(localStorage.getItem("studentWorkExperience") || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      document.body.classList.add("edit-active");
    } else {
      document.body.classList.remove("edit-active");
    }
  }, [isEditing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
        localStorage.setItem("studentProfileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("studentName", name);
    localStorage.setItem("studentBio", bio);
    localStorage.setItem("studentEmail", email);
    localStorage.setItem("studentSkills", skills);
    localStorage.setItem("studentEducation", education);
    localStorage.setItem("studentSocialLink", socialLink);
    localStorage.setItem("studentPassoutYear", passoutYear);
    localStorage.setItem("studentWorkExperience", workExperience);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsEditing(false);
      setIsClosing(false);
    }, 400);
  };

  return (
    <>
      <div className="floating-objects">
        <div className="floating-object left-object"></div>
        <div className="floating-object right-object"></div>
        <div className="floating-object top-left-object"></div>
        <div className="floating-object top-right-object"></div>
      </div>
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
          <div><h3>5</h3><p>Projects</p></div>
          <div><h3>100</h3><p>Followers</p></div>
          <div><h3>75</h3><p>Following</p></div>
        </div>

        <button onClick={() => setIsEditing(true)} className="edit-button full-width">Edit Profile</button>

        <div className="profile-summary">
          <div className="summary-item"><FaUser className="summary-icon" /><h3>{name}</h3></div>
          <div className="summary-item"><FaInfoCircle className="summary-icon" /><p>{bio}</p></div>
          <div className="summary-item"><FaEnvelope className="summary-icon" /><p>{email}</p></div>
          <div className="summary-item"><FaTools className="summary-icon" /><p>{skills}</p></div>
          <div className="summary-item"><FaGraduationCap className="summary-icon" /><p>{education}</p></div>
          <div className="summary-item"><FaCalendarAlt className="summary-icon" /><p>{passoutYear}</p></div>
          <div className="summary-item"><FaBookOpen className="summary-icon" /><p>{workExperience}</p></div>
          <div className="summary-item"><FaGlobe className="summary-icon" /><p>{socialLink}</p></div>
        </div>

        {isEditing && (
          <>
            <div className="blur-layer"></div>
            <div className={`edit-modal ${isClosing ? 'closing' : ''}`}>
              <div className="edit-form">
                <h2>Edit Profile</h2>

                <div className="input-block"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="input-block"><label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="input-block"><label>Skills</label><input value={skills} onChange={(e) => setSkills(e.target.value)} /></div>
                <div className="input-block"><label>Education</label><input value={education} onChange={(e) => setEducation(e.target.value)} /></div>
                <div className="input-block"><label>Passout Year</label><input type="number" value={passoutYear} onChange={(e) => setPassoutYear(e.target.value)} /></div>
                <div className="input-block"><label>Work Experience</label><textarea value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} /></div>
                <div className="input-block"><label>Bio</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} /></div>
                <div className="input-block"><label>Social Link</label><input value={socialLink} onChange={(e) => setSocialLink(e.target.value)} /></div>

                <div className="button-group">
                  <button onClick={handleSave} className="save-button"><FaSave /> Save</button>
                  <button onClick={handleCancel} className="cancel-button"><FaTimes /> Cancel</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default StudentProfile;
