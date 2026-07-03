import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    if (user) {
      fetchUserAvatar();
    }
  }, [user]);
  useEffect(() => {
    const handleProfileUpdate = () => {
      if (user) fetchUserAvatar();
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, [user]);

  const fetchUserAvatar = async () => {
    try {
      const { data } = await api.get("/users/me");
      setAvatar(data.avatar || "");
    } catch (err) {
      console.error("Failed to fetch user avatar", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDefaultDP = (gender) => {
    if (gender === "male") return "/assets/default-dp-male.png";
    if (gender === "female") return "/assets/default-dp-female.png";
    return "/assets/default-dp.png";
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        {/* Logo Section */}
        <Link to="/" style={styles.logoLink}>
          <div style={styles.logoWrapper}>
            <div style={styles.logoIconContainer}>
              <img
                src="/assets/logo.png"
                alt="Logo"
                style={styles.logoImage}
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = "flex";
                  }
                }}
              />
              <div style={styles.logoFallback}>B</div>
            </div>
            <span style={styles.logoText}>SUPERBLOGER</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          {user ? (
            <>
              <Link to="/" style={styles.navLink}>
                🏠 Home
              </Link>
              <Link to="/create" style={styles.navLink}>
                ✍️ Create
              </Link>

              {/* ✅ Profile with DP */}
              <Link to="/profile" style={styles.profileLink}>
                <div style={styles.navAvatar}>
                  <img
                    src={avatar || getDefaultDP(user.gender)}
                    alt="Profile"
                    style={styles.navAvatarImage}
                    onError={(e) => {
                      e.target.src = getDefaultDP(user.gender);
                    }}
                  />
                </div>
                <span style={styles.profileText}>Profile</span>
              </Link>

              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>
                SIGN IN
              </Link>
              <Link to="/register" style={styles.signUpBtn}>
                SIGN UP
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "65px",
    backgroundColor: "#1A4D5C",
    background: "linear-gradient(135deg, #1A4D5C 0%, #2A6B7C 100%)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    borderBottom: "2px solid rgba(255, 107, 53, 0.3)",
  },
  navContainer: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoLink: {
    textDecoration: "none",
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIconContainer: {
    position: "relative",
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    overflow: "hidden",
    border: "2px solid rgba(255, 107, 53, 0.5)",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  logoFallback: {
    display: "none",
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #FF6B35, #FF8E53)",
    color: "white",
    fontWeight: "bold",
    fontSize: "1.4em",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "white",
    fontSize: "1.4em",
    fontWeight: "700",
    letterSpacing: "2px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "0.95em",
    letterSpacing: "0.5px",
    fontWeight: "500",
    transition: "opacity 0.2s",
  },
  profileLink: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "white",
    textDecoration: "none",
    fontSize: "0.95em",
    letterSpacing: "0.5px",
    fontWeight: "600",
    padding: "6px 14px 6px 6px",
    borderRadius: "25px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transition: "all 0.2s",
    border: "1.5px solid rgba(255, 255, 255, 0.2)",
  },
  navAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "2px solid #FF6B35",
    flexShrink: 0,
    backgroundColor: "#FF6B35",
  },
  navAvatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  profileText: {
    color: "white",
  },

  signUpBtn: {
    color: "white",
    textDecoration: "none",
    fontSize: "0.95em",
    letterSpacing: "0.5px",
    fontWeight: "600",
    padding: "8px 20px",
    background: "linear-gradient(135deg, #FF6B35, #FF8E53)",
    borderRadius: "6px",
    boxShadow: "0 2px 10px rgba(255, 107, 53, 0.3)",
  },
  logoutBtn: {
    background: "transparent",
    color: "white",
    border: "1.5px solid rgba(255, 255, 255, 0.3)",
    padding: "8px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9em",
    letterSpacing: "0.5px",
    transition: "all 0.2s",
  },
};

export default Navbar;
