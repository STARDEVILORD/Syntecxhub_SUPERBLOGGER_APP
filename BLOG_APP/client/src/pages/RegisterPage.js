import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      return "Please fill in all fields";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Please enter a valid email";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const { data } = await api.post("/auth/register", submitData);
      localStorage.setItem("token", data.token);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.backgroundContainer}>
        <img
          src="/assets/auth-bg.jpg"
          alt="Background"
          style={styles.backgroundImage}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div style={styles.overlay}></div>
      </div>
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>📝 Create Account</h2>
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter your name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter your email"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="At least 6 characters"
                minLength="6"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading && styles.buttonDisabled),
              }}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account?{" "}
            <Link to="/login" style={styles.link}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "calc(100vh - 60px)",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%)",
  },
  container: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "450px",
  },
  card: {
    backgroundColor: "white",
    padding: "40px 35px",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  title: {
    textAlign: "center",
    color: "#1A4D5C",
    marginBottom: "30px",
    fontSize: "1.8em",
    fontWeight: "700",
  },
  error: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    border: "1px solid #fcc",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    color: "#333",
    fontWeight: "600",
    fontSize: "0.9em",
  },
  input: {
    padding: "13px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "14px",
    backgroundColor: "#FF6B35",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
  },
  buttonDisabled: {
    backgroundColor: "#999",
    cursor: "not-allowed",
  },
  footer: {
    textAlign: "center",
    marginTop: "25px",
    color: "#666",
  },
  link: {
    color: "#FF6B35",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default RegisterPage;
