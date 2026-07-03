import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import LandingPage from "./LandingPage";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (!user) {
    return <LandingPage />;
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading posts...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      {/* Background Image */}
      <div style={styles.backgroundContainer}>
        <img
          src="/assets/home-bg.jpg"
          alt="Background"
          style={styles.backgroundImage}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div style={styles.overlay}></div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>📝COMMUNTIY BLOGS</h1>
          <Link to="/create" style={styles.createBtn}>
            ✍️ Create New Post
          </Link>
        </header>

        {/* Posts */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {posts.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📭</div>
            <h2 style={styles.emptyTitle}>No posts yet</h2>
            <p style={styles.emptyText}>Be the first to share your thoughts!</p>
            <Link to="/create" style={styles.createLink}>
              Create your first post
            </Link>
          </div>
        ) : (
          <div style={styles.postsGrid}>
            {posts.map((post) => (
              <article key={post._id} style={styles.postCard}>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={styles.postImage}
                  />
                )}
                <div style={styles.postContent}>
                  <h2 style={styles.postTitle}>{post.title}</h2>

                  <div style={styles.authorBar}>
                    <div style={styles.authorAvatar}>
                      {post.author?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <div style={styles.authorName}>
                        {post.author?.name || "Anonymous"}
                      </div>
                      <div style={styles.postDate}>
                        📅 {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <p style={styles.postExcerpt}>
                    {post.content.replace(/<[^>]*>/g, "").substring(0, 120)}
                    ...
                  </p>

                  <div style={styles.stats}>
                    <span style={styles.statItem}>
                      ❤️ {post.likesCount || 0}
                    </span>
                    <span style={styles.statItem}>
                      💬 {post.commentsCount || 0}
                    </span>
                  </div>

                  <div style={styles.actions}>
                    <Link to={`/post/${post._id}`} style={styles.readMoreBtn}>
                      Read More →
                    </Link>
                    {user.id === post.author?._id && (
                      <div style={styles.ownerActions}>
                        <Link to={`/edit/${post._id}`} style={styles.editBtn}>
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          style={styles.deleteBtn}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "calc(100vh - 60px)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  backgroundContainer: {
    position: "fixed",
    top: "60px",
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
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, rgba(26, 77, 92, 0.7) 0%, rgba(42, 107, 124, 0.5) 100%)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    paddingTop: "90px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
    flex: 1,
  },
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
  loadingText: {
    color: "white",
    fontSize: "1.2em",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingTop: "40px",
    paddingRight: "30px",
    paddingBottom: "50px",
    paddingLeft: "80px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  pageTitle: {
    margin: 0,
    color: "#1A4D5C",
    fontSize: "1.8em",
  },
  createBtn: {
    padding: "12px 24px",
    backgroundColor: "#FF6B35",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
  },
  errorBox: {
    backgroundColor: "rgba(254, 226, 226, 0.95)",
    color: "#c33",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    color: "#666",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  emptyIcon: {
    fontSize: "5em",
    marginBottom: "20px",
  },
  emptyTitle: {
    color: "#1A4D5C",
    margin: "0 0 10px 0",
    fontSize: "2em",
  },
  emptyText: {
    fontSize: "1.1em",
    marginBottom: "25px",
  },
  createLink: {
    display: "inline-block",
    padding: "12px 30px",
    backgroundColor: "#FF6B35",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
  },
  postsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
  },
  postCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  postImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  postContent: {
    padding: "20px",
  },
  postTitle: {
    margin: "0 0 15px 0",
    color: "#1A4D5C",
    fontSize: "1.3em",
  },
  authorBar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f0f0f0",
  },
  authorAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#FF6B35",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "0.9em",
  },
  authorName: {
    fontWeight: "600",
    color: "#333",
    fontSize: "0.9em",
  },
  postDate: {
    color: "#999",
    fontSize: "0.75em",
  },
  postExcerpt: {
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "15px",
    fontSize: "0.95em",
  },
  stats: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
    paddingTop: "10px",
    borderTop: "1px solid #f0f0f0",
  },
  statItem: {
    color: "#666",
    fontSize: "0.85em",
    fontWeight: "500",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  readMoreBtn: {
    padding: "8px 18px",
    backgroundColor: "#1A4D5C",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "0.9em",
    fontWeight: "500",
  },
  ownerActions: {
    display: "flex",
    gap: "8px",
  },
  editBtn: {
    padding: "6px 10px",
    backgroundColor: "#28a745",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "0.9em",
  },
  deleteBtn: {
    padding: "6px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "0.9em",
  },
};

export default HomePage;
