import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    hobbies: "",
    bio: "",
  });
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await api.get("/users/me");
      setProfile(data);
      setFormData({
        name: data.name || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
        hobbies: Array.isArray(data.hobbies) ? data.hobbies.join(", ") : "",
        bio: data.bio || "",
      });
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get(`/posts/user/${user.id}`);
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [fetchProfile, fetchPosts]);

  const handleDPChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const { data } = await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(data);
      updateUser(data);
      alert("✅ Profile picture updated!");
    } catch (err) {
      alert("Failed to upload image");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/users/me", {
        name: formData.name,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || null,
        hobbies: formData.hobbies,
        bio: formData.bio,
      });
      setProfile(data);
      updateUser(data);
      setEditing(false);
      alert("✅ Profile updated!");
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      const { data } = await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(data);
      updateUser(data);
      alert("✅ Cover photo updated!");
    } catch (err) {
      alert("Failed to upload cover photo");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.notLoggedIn}>
          <h2>🔒 Access Denied</h2>
          <p>Please login to view your profile.</p>
          <Link to="/login" style={styles.loginBtn}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: "white" }}>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.errorBox}>Failed to load profile</div>
      </div>
    );
  }
  const getDefaultDP = (gender) => {
    if (profile.avatar) return profile.avatar;
    if (gender === "male") return "/assets/default-dp-male.png";
    if (gender === "female") return "/assets/default-dp-female.png";
    return "/assets/default-dp.png"; // Generic fallback
  };

  const dpUrl = getDefaultDP(profile.gender);
  const hasAvatar = profile.avatar && profile.avatar.length > 0;
  const hasCover = profile.coverImage && profile.coverImage.length > 0;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.backgroundContainer}>
        <div style={styles.overlay}></div>
      </div>

      <div style={styles.content}>
        <div style={styles.profileCard}>
          <div
            style={styles.coverImageContainer}
            onClick={() => coverInputRef.current.click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.cursor = "pointer";
            }}
          >
            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              onChange={handleCoverChange}
              style={{ display: "none" }}
            />

            {hasCover ? (
              <>
                <img
                  src={profile.coverImage}
                  alt="Cover"
                  style={styles.coverImage}
                />
                <div style={styles.coverOverlay} className="coverOverlay">
                  <span style={styles.coverText}>📷 Change Cover Photo</span>
                </div>
              </>
            ) : (
              <div style={styles.coverPlaceholder}>
                <span style={styles.coverText}>📷 Add Cover Photo</span>
              </div>
            )}

            {uploading && (
              <div style={styles.coverUploadingOverlay}>
                <div style={styles.smallSpinner}></div>
                <span style={{ color: "white", marginTop: "10px" }}>
                  Uploading...
                </span>
              </div>
            )}
          </div>
          <div style={styles.profileContent}>
            <div style={styles.leftSection}>
              <div style={styles.dpContainer}>
                {hasAvatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    style={styles.dpImage}
                  />
                ) : (
                  <div
                    style={{
                      ...styles.dpImage,
                      background:
                        profile.gender === "female"
                          ? "linear-gradient(135deg, #FF69B4, #FF1493)"
                          : profile.gender === "male"
                            ? "linear-gradient(135deg, #4682B4, #1E90FF)"
                            : "linear-gradient(135deg, #FF6B35, #FF8E53)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "4em",
                      fontWeight: "bold",
                    }}
                  >
                    {profile.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleDPChange}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                style={styles.changeDPBtn}
              >
                📷 Change Photo
              </button>
              <div style={styles.statsBox}>
                <div style={styles.statNumber}>{posts.length}</div>
                <div style={styles.statLabel}>Posts</div>
              </div>
            </div>
            <div style={styles.rightSection}>
              {editing ? (
                // ✅ EDIT MODE
                <div style={styles.editForm}>
                  <h2 style={styles.editTitle}>Edit Profile</h2>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      style={styles.input}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Hobbies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.hobbies}
                      onChange={(e) =>
                        setFormData({ ...formData, hobbies: e.target.value })
                      }
                      placeholder="Reading, Coding, Music"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                      style={{
                        ...styles.input,
                        minHeight: "80px",
                        resize: "vertical",
                      }}
                      maxLength="500"
                    />
                  </div>

                  <div style={styles.editButtons}>
                    <button
                      onClick={() => setEditing(false)}
                      style={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={styles.saveBtn}
                    >
                      {saving ? "Saving..." : "💾 Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={styles.viewMode}>
                  <h1 style={styles.profileName}>
                    {profile.name}
                    <button
                      onClick={() => setEditing(true)}
                      style={styles.editIconBtn}
                    >
                      ✏️ Edit
                    </button>
                  </h1>
                  <p style={styles.profileEmail}>{profile.email}</p>

                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoIcon}>👤</span>
                      <div>
                        <div style={styles.infoLabel}>Gender</div>
                        <div style={styles.infoValue}>
                          {profile.gender || "Not specified"}
                        </div>
                      </div>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoIcon}>🎂</span>
                      <div>
                        <div style={styles.infoLabel}>Date of Birth</div>
                        <div style={styles.infoValue}>
                          {profile.dateOfBirth
                            ? new Date(profile.dateOfBirth).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )
                            : "Not specified"}
                        </div>
                      </div>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.infoIcon}>🎯</span>
                      <div>
                        <div style={styles.infoLabel}>Hobbies</div>
                        <div style={styles.infoValue}>
                          {profile.hobbies && profile.hobbies.length > 0
                            ? profile.hobbies.join(", ")
                            : "Not specified"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {profile.bio && (
                    <div style={styles.bioSection}>
                      <h3 style={styles.bioTitle}>About Me</h3>
                      <p style={styles.bioText}>{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Posts Section */}
        <div style={styles.postsSection}>
          <h2 style={styles.postsTitle}>📝 My Posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <div style={styles.noPosts}>
              <p>No posts yet. Start sharing!</p>
              <Link to="/create" style={styles.createLink}>
                Create your first post →
              </Link>
            </div>
          ) : (
            <div style={styles.postsList}>
              {posts.map((post) => (
                <div key={post._id} style={styles.postItem}>
                  <h3>{post.title}</h3>
                  <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                  <Link to={`/post/${post._id}`} style={styles.viewPostLink}>
                    View →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "calc(100vh - 60px)",
    position: "relative",
  },
  backgroundContainer: {
    position: "fixed",
    top: "60px",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    background:
      "linear-gradient(135deg, #1A4D5C 0%, #2A6B7C 50%, #1A4D5C 100%)",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.3)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    padding: "30px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    marginBottom: "30px",
  },
  coverImageContainer: {
    width: "100%",
    height: "200px",
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #1A4D5C 0%, #FF6B35 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "1.2em",
    fontWeight: "500",
  },
  coverText: {
    background: "rgba(0, 0, 0, 0.3)",
    padding: "10px 20px",
    borderRadius: "20px",
  },
  dpPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FF6B35",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dpEmoji: {
    fontSize: "5em",
    color: "white",
  },
  profileContent: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "40px",
    padding: "30px",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  dpContainer: {
    position: "relative",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "5px solid white",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  },
  dpImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dpOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  smallSpinner: {
    width: "30px",
    height: "30px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  changeDPBtn: {
    padding: "8px 20px",
    backgroundColor: "#1A4D5C",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.85em",
    fontWeight: "500",
  },
  statsBox: {
    textAlign: "center",
    padding: "15px 30px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    width: "100%",
  },
  statNumber: {
    fontSize: "2em",
    fontWeight: "700",
    color: "#FF6B35",
  },
  statLabel: {
    fontSize: "0.9em",
    color: "#666",
    marginTop: "5px",
  },
  rightSection: {
    paddingTop: "10px",
  },
  viewMode: {
    width: "100%",
  },
  profileName: {
    color: "#1A4D5C",
    margin: "0 0 5px 0",
    fontSize: "2em",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
  editIconBtn: {
    padding: "6px 15px",
    backgroundColor: "transparent",
    color: "#FF6B35",
    border: "1.5px solid #FF6B35",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.5em",
    fontWeight: "500",
  },
  profileEmail: {
    color: "#666",
    margin: "0 0 25px 0",
    fontSize: "1em",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "25px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
  },
  infoIcon: {
    fontSize: "1.8em",
  },
  infoLabel: {
    color: "#999",
    fontSize: "0.75em",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    color: "#333",
    fontSize: "0.95em",
    fontWeight: "600",
    marginTop: "3px",
    textTransform: "capitalize",
  },
  bioSection: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    borderLeft: "4px solid #FF6B35",
  },
  bioTitle: {
    color: "#1A4D5C",
    margin: "0 0 10px 0",
    fontSize: "1.1em",
  },
  bioText: {
    color: "#555",
    lineHeight: "1.6",
    margin: 0,
  },
  editForm: {
    width: "100%",
  },
  editTitle: {
    color: "#1A4D5C",
    margin: "0 0 20px 0",
    fontSize: "1.5em",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#333",
    fontWeight: "600",
    fontSize: "0.85em",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "0.95em",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  editButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#666",
    border: "2px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9em",
    fontWeight: "500",
  },
  saveBtn: {
    padding: "10px 20px",
    backgroundColor: "#FF6B35",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9em",
    fontWeight: "600",
  },
  postsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  postsTitle: {
    color: "#1A4D5C",
    margin: "0 0 20px 0",
  },
  noPosts: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#666",
  },
  createLink: {
    color: "#FF6B35",
    textDecoration: "none",
    fontWeight: "600",
    display: "inline-block",
    marginTop: "15px",
  },
  postsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  postItem: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewPostLink: {
    color: "#FF6B35",
    textDecoration: "none",
    fontWeight: "600",
  },

  // Loading & Errors
  loadingContainer: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  notLoggedIn: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "16px",
    maxWidth: "500px",
    margin: "50px auto",
  },
  loginBtn: {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
  },
  errorBox: {
    backgroundColor: "white",
    color: "#c33",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
  },
  coverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s",
    cursor: "pointer",
  },
  coverUploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default ProfilePage;
