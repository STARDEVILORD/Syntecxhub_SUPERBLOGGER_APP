import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2 style={styles.title}>Page Not Found</h2>
      <p style={styles.text}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={styles.button}>
        🏠 Go Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
  code: {
    fontSize: "8em",
    color: "#ddd",
    margin: "0",
  },
  title: {
    color: "#333",
    margin: "20px 0",
  },
  text: {
    color: "#666",
    marginBottom: "30px",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
  },
};

export default NotFoundPage;
