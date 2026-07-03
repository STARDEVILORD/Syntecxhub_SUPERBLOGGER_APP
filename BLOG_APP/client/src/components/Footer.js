const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.creditLine}>
          <span style={styles.developedText}>Developed by</span>
          <span style={styles.authorName}>Shriram</span>
          <span style={styles.divider}>|</span>
          <span style={styles.copyright}>
            ©️ 2026 <span style={styles.brandName}>SUPERBLOGER</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background:
      "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
    color: "white",
    padding: "30px 20px",
    textAlign: "center",
    marginTop: "auto",
    borderTop: "2px solid rgba(255, 107, 53, 0.3)",
    boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  creditLine: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    fontSize: "1em",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    letterSpacing: "0.5px",
  },
  developedText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "400",
  },
  authorName: {
    color: "#FF6B35",
    fontWeight: "700",
    fontSize: "1.05em",
    letterSpacing: "0.5px",
  },
  divider: {
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "300",
    margin: "0 2px",
  },
  copyright: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "400",
  },
  brandName: {
    color: "#FF6B35",
    fontWeight: "700",
    letterSpacing: "2px",
  },
};

export default Footer;
