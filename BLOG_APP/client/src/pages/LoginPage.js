import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password");
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
          <h2 style={styles.title}>🔐 Login</h2>
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
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
                autoComplete="email"
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
                placeholder="Enter your password"
                autoComplete="current-password"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>
              Register here
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
    padding: "45px 40px",
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
    gap: "20px",
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
    transition: "background-color 0.2s",
    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
  },
  buttonDisabled: {
    backgroundColor: "#999",
    cursor: "not-allowed",
    boxShadow: "none",
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

export default LoginPage;
