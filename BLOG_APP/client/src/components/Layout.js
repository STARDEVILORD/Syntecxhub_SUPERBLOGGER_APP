import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <main style={styles.content}>{children}</main>
      <Footer />
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    width: "100%",
  },
};

export default Layout;
