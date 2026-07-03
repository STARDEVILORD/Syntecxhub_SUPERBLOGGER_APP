import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <section style={styles.heroSection}>
        {/* Background Video - Full Screen */}
        <video
          style={styles.backgroundVideo}
          src="/assets/background.mp4"
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div style={styles.overlay}></div>

        {/* Text Content on Top of Video */}
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Share Your <span style={styles.heroTitleAccent}>Stories</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Create, publish, and grow your blog with our powerful platform.
            <br />
            Join thousands of writers sharing their passion.
          </p>

          <div style={styles.heroButtons}>
            <Link to="/register" style={styles.primaryButton}>
              🚀 Get Started Free
            </Link>
            <Link to="/login" style={styles.secondaryButton}>
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
          <p style={styles.sectionSubtitle}>
            Everything you need to create amazing content
          </p>
        </div>

        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section style={styles.echoesSection}>
        <div style={styles.echoesContent}>
          {/* Left Side - Text */}
          <div style={styles.echoesText}>
            <h2 style={styles.echoesTitle}>
              Echoes of the <span style={styles.echoesTitleAccent}>Hearts</span>
            </h2>
            <p style={styles.echoesDescription}>
              A space to capture fleeting moments of joy and profound truths.
              Bring your inner world to life, one post at a time.
            </p>
            <Link to="/create" style={styles.echoesButton}>
              Start Creating →
            </Link>
          </div>
          <div style={styles.echoesImageContainer}>
            <img
              src="/assets/echoes-image.jpg"
              alt="Echoes illustration"
              style={styles.echoesImage}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Start Blogging?</h2>
        <p style={styles.ctaText}>
          Join our community of writers and start sharing your stories today.
        </p>
        <Link to="/register" style={styles.ctaButton}>
          ✍️ Create Your Blog
        </Link>
      </section>
    </div>
  );
};

const features = [
  {
    icon: "🖼️",
    title: "Image Upload",
    description: "Upload and manage your images with cloud storage.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description: "Your content is safe with encryption.",
  },
  {
    icon: "💬",
    title: "Engage Readers",
    description: "Built-in comments and likes.",
  },
];

const styles = {
  container: { width: "100%" },
  echoesSection: {
    backgroundColor: "#1A4D5C",
    padding: "80px 20px",
    position: "relative",
    overflow: "hidden",
  },
  echoesContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "center",
    minHeight: "500px",
  },
  echoesText: {
    color: "white",
    paddingRight: "40px",
  },
  echoesTitle: {
    fontSize: "3.5em",
    fontWeight: "700",
    margin: "0 0 25px 0",
    lineHeight: "1.2",
    color: "white",
  },
  echoesTitleAccent: {
    color: "#FF6B35",
    display: "block",
  },
  echoesDescription: {
    fontSize: "1.2em",
    lineHeight: "1.7",
    marginBottom: "35px",
    opacity: 0.95,
    color: "white",
  },
  echoesButton: {
    display: "inline-block",
    padding: "14px 40px",
    backgroundColor: "#FF6B35",
    color: "white",
    textDecoration: "none",
    borderRadius: "50px",
    fontSize: "1.05em",
    fontWeight: "600",
    boxShadow: "0 5px 20px rgba(255, 107, 53, 0.4)",
  },
  echoesImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  echoesImage: {
    width: "100%",
    maxWidth: "500px",
    height: "auto",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
  },
  heroSection: {
    position: "relative",
    width: "100%",
    height: "100vh",
    minHeight: "600px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)",
    zIndex: 2,
  },
  heroContent: {
    position: "relative",
    zIndex: 3,
    textAlign: "center",
    color: "white",
    maxWidth: "900px",
    padding: "0 20px",
  },
  heroTitle: {
    fontSize: "4.5em",
    fontWeight: "700",
    margin: "0 0 25px 0",
    textShadow: "0 4px 20px rgba(0,0,0,0.4)",
    lineHeight: "1.2",
  },
  heroTitleAccent: {
    color: "#FFE5D9",
    display: "inline-block",
  },
  heroSubtitle: {
    fontSize: "1.3em",
    lineHeight: "1.6",
    margin: "0 0 40px 0",
    fontWeight: "300",
    textShadow: "0 2px 10px rgba(0,0,0,0.4)",
  },
  heroButtons: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "60px",
  },
  primaryButton: {
    padding: "16px 40px",
    backgroundColor: "white",
    color: "#FF6B35",
    textDecoration: "none",
    borderRadius: "50px",
    fontSize: "1.1em",
    fontWeight: "700",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  secondaryButton: {
    padding: "16px 40px",
    backgroundColor: "transparent",
    color: "white",
    textDecoration: "none",
    borderRadius: "50px",
    fontSize: "1.1em",
    fontWeight: "600",
    border: "2px solid white",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  featuresSection: {
    padding: "80px 20px",
    backgroundColor: "white",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "60px",
    maxWidth: "600px",
    margin: "0 auto 60px auto",
  },
  sectionTitle: {
    fontSize: "2.8em",
    color: "#1A4D5C",
    margin: "0 0 15px 0",
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: "1.2em",
    color: "#666",
    margin: 0,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  featureCard: {
    padding: "40px 30px",
    backgroundColor: "#f8f9fa",
    borderRadius: "16px",
    textAlign: "center",
    border: "2px solid transparent",
    transition: "all 0.3s",
  },
  featureIcon: {
    fontSize: "3.5em",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "1.4em",
    color: "#1A4D5C",
    margin: "0 0 15px 0",
    fontWeight: "600",
  },
  featureDescription: {
    color: "#666",
    lineHeight: "1.6",
    margin: 0,
  },
  showcaseSection: {
    padding: "80px 20px",
    background: "linear-gradient(135deg, #1A4D5C 0%, #2A6B7C 100%)",
  },
  showcaseContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  showcaseText: { color: "white" },
  showcaseTitle: {
    fontSize: "2.8em",
    margin: "0 0 20px 0",
    fontWeight: "700",
    lineHeight: "1.2",
  },
  showcaseTitleAccent: { color: "#FF6B35" },
  showcaseDescription: {
    fontSize: "1.1em",
    lineHeight: "1.7",
    marginBottom: "30px",
    opacity: 0.9,
  },
  showcaseList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 30px 0",
  },
  showcaseListItem: {
    padding: "8px 0",
    fontSize: "1.05em",
  },
  showcaseButton: {
    display: "inline-block",
    padding: "14px 35px",
    backgroundColor: "#FF6B35",
    color: "white",
    textDecoration: "none",
    borderRadius: "50px",
    fontSize: "1em",
    fontWeight: "600",
  },
  showcaseImageContainer: {
    textAlign: "center",
  },
  showcaseImage: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  ctaSection: {
    padding: "80px 20px",
    background: "linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)",
    textAlign: "center",
    color: "white",
  },
  ctaTitle: {
    fontSize: "2.5em",
    margin: "0 0 20px 0",
    fontWeight: "700",
  },
  ctaText: {
    fontSize: "1.2em",
    margin: "0 0 30px 0",
    opacity: 0.95,
  },
  ctaButton: {
    display: "inline-block",
    padding: "16px 45px",
    backgroundColor: "white",
    color: "#FF6B35",
    textDecoration: "none",
    borderRadius: "50px",
    fontSize: "1.1em",
    fontWeight: "700",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
};

export default LandingPage;
