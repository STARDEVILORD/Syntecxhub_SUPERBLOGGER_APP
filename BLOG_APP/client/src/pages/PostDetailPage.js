import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const PostDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/posts/${id}`);
      setPost(data);
      setLikesCount(data.likesCount || 0);
      setLiked(data.likes?.some((like) => like._id === user?.id) || false);
    } catch (err) {
      setError(err.response?.data?.msg || "Post not found");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await api.get(`/posts/${id}/comments`);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
      const { data } = await api.post(`/posts/${id}/like`);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (err) {
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      console.error("Like failed", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const { data } = await api.post(`/posts/${id}/comments`, {
        content: newComment,
      });
      setComments([data, ...comments]);
      setNewComment("");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/posts/${id}/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert("Failed to delete comment");
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Delete this post permanently?")) {
      try {
        await api.delete(`/posts/${id}`);
        navigate("/");
      } catch (err) {
        alert("Failed to delete post");
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.errorCard}>
          <h2>😕 {error || "Post not found"}</h2>
          <Link to="/" style={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && user.id === post.author?._id;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.detailCard}>
        {/* Back Button */}
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>
        <h1 style={styles.title}>{post.title}</h1>
        <div style={styles.authorBar}>
          <div style={styles.authorInfo}>
            <div style={styles.authorAvatar}>
              {post.author?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <div style={styles.authorName}>
                {post.author?.name || "Anonymous"}
              </div>
              <div style={styles.postDate}>
                📅{" "}
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {post.createdAt !== post.updatedAt && (
                  <span style={styles.editedBadge}> (edited)</span>
                )}
              </div>
            </div>
          </div>
          {isAuthor && (
            <div style={styles.authorActions}>
              <Link to={`/edit/${post._id}`} style={styles.editLink}>
                ✏️ Edit
              </Link>
              <button onClick={handleDeletePost} style={styles.deleteBtn}>
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            style={styles.featuredImage}
          />
        )}
        <div
          style={styles.content}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />
        <div style={styles.statsBar}>
          <button
            onClick={handleLike}
            style={{
              ...styles.likeBtn,
              ...(liked && styles.likeBtnActive),
            }}
            disabled={isLiking}
          >
            {liked ? "❤️" : "🤍"} {likesCount}{" "}
            {likesCount === 1 ? "Like" : "Likes"}
          </button>
          <div style={styles.commentCount}>
            💬 {comments.length}{" "}
            {comments.length === 1 ? "Comment" : "Comments"}
          </div>
        </div>
        {user ? (
          <form onSubmit={handleAddComment} style={styles.commentForm}>
            <div style={styles.commentFormHeader}>
              <div style={styles.commentAvatar}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={styles.commentUser}>{user.name}</span>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={styles.commentInput}
              rows="3"
              maxLength="1000"
            />
            <div style={styles.commentActions}>
              <span style={styles.charCount}>{newComment.length}/1000</span>
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                style={{
                  ...styles.submitCommentBtn,
                  ...((!newComment.trim() || submittingComment) &&
                    styles.submitCommentBtnDisabled),
                }}
              >
                {submittingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        ) : (
          <div style={styles.loginPrompt}>
            <Link to="/login" style={styles.loginLink}>
              Login
            </Link>{" "}
            to like and comment
          </div>
        )}
        <div style={styles.commentsSection}>
          <h3 style={styles.commentsTitle}>💬 Comments ({comments.length})</h3>
          {comments.length === 0 ? (
            <div style={styles.noComments}>
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div style={styles.commentsList}>
              {comments.map((comment) => (
                <div key={comment._id} style={styles.commentItem}>
                  <div style={styles.commentHeader}>
                    <div style={styles.commentAvatarSmall}>
                      {comment.author?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div style={styles.commentMeta}>
                      <div style={styles.commentAuthor}>
                        {comment.author?.name || "Anonymous"}
                      </div>
                      <div style={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {user &&
                      (user.id === comment.author?._id ||
                        user.id === post.author?._id) && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          style={styles.commentDeleteBtn}
                        >
                          🗑️
                        </button>
                      )}
                  </div>
                  <p style={styles.commentText}>{comment.content}</p>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
  },
  detailCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    padding: "50px",
    width: "100%",
    maxWidth: "900px",
  },
  backLink: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "0.95em",
    fontWeight: "500",
    display: "inline-block",
    marginBottom: "20px",
  },
  title: {
    fontSize: "2.5em",
    color: "#1A4D5C",
    margin: "0 0 20px 0",
    fontWeight: "700",
    lineHeight: "1.2",
  },
  authorBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "20px",
    borderBottom: "2px solid #f0f0f0",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },
  authorInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  authorAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#FF6B35",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.3em",
    fontWeight: "bold",
  },
  authorName: {
    fontWeight: "600",
    color: "#333",
    fontSize: "1.05em",
  },
  postDate: {
    color: "#999",
    fontSize: "0.85em",
    marginTop: "2px",
  },
  editedBadge: {
    color: "#888",
    fontStyle: "italic",
    fontSize: "0.9em",
  },
  authorActions: {
    display: "flex",
    gap: "10px",
  },
  editLink: {
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "0.9em",
  },
  deleteBtn: {
    padding: "8px 16px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9em",
  },
  featuredImage: {
    width: "100%",
    maxHeight: "500px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "30px",
  },
  content: {
    fontSize: "1.1em",
    lineHeight: "1.8",
    color: "#444",
    marginBottom: "30px",
  },
  statsBar: {
    display: "flex",
    gap: "20px",
    padding: "20px 0",
    borderTop: "2px solid #f0f0f0",
    borderBottom: "2px solid #f0f0f0",
    marginBottom: "30px",
    alignItems: "center",
  },
  likeButton: {
    padding: "10px 20px",
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: "#e0e0e0",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "0.95em",
    fontWeight: "600",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  likeButtonActive: {
    backgroundColor: "#ffe5e5",
    borderColor: "#ff4757",
    color: "#ff4757",
  },
  commentCount: {
    color: "#666",
    fontSize: "0.95em",
    fontWeight: "500",
  },
  commentForm: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px",
  },
  commentFormHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  commentAvatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    backgroundColor: "#1A4D5C",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  commentUser: {
    fontWeight: "600",
    color: "#333",
  },
  commentInput: {
    width: "100%",
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "0.95em",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
    minHeight: "70px",
  },
  commentActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  charCount: {
    color: "#999",
    fontSize: "0.8em",
  },
  submitCommentBtn: {
    padding: "8px 20px",
    backgroundColor: "#FF6B35",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9em",
  },
  submitCommentBtnDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  loginPrompt: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
  },
  loginLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "600",
  },
  commentsSection: {
    marginTop: "30px",
  },
  commentsTitle: {
    color: "#1A4D5C",
    marginBottom: "20px",
    fontSize: "1.3em",
  },
  noComments: {
    textAlign: "center",
    padding: "30px",
    color: "#999",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  commentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  commentItem: {
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
  },
  commentHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  commentAvatarSmall: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#1A4D5C",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "0.85em",
  },
  commentMeta: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: "600",
    color: "#333",
    fontSize: "0.9em",
  },
  commentDate: {
    color: "#999",
    fontSize: "0.75em",
  },
  commentDeleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9em",
  },
  commentText: {
    margin: 0,
    color: "#444",
    lineHeight: "1.5",
    fontSize: "0.95em",
  },
  loadingContainer: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    color: "white",
    fontSize: "1.2em",
  },
  errorCard: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    maxWidth: "500px",
  },
};

export default PostDetailPage;
