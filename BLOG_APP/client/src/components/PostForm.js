import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "../contexts/AuthContext";

const PostForm = ({ post, onSubmit, loading }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const quillRef = useRef(null);
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.imageUrl || "");
  const [error, setError] = useState("");

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image", "code-block"],
          ["clean"],
        ],
      },
    }),
    [],
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "align",
    "link",
    "image",
    "code-block",
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      setError("Please write some content");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to save post");
    }
  };

  const wordCount = content
    .replace(/<[^>]*>/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div style={styles.pageWrapper}>
      <form onSubmit={handleSubmit} style={styles.formCard}>
        {/* Header */}
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>
            {post ? "✏️ Edit Post" : "✍️ Create New Post"}
          </h2>
          <p style={styles.formSubtitle}>
            {user
              ? `Welcome, ${user.name}!`
              : "Share your thoughts with the world"}
          </p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span> {error}
          </div>
        )}

        {/* Title */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            <span style={styles.labelIcon}>📌</span> Post Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging title..."
            style={styles.titleInput}
            maxLength={200}
            required
          />
          <div style={styles.charCount}>{title.length}/200</div>
        </div>

        {/* Featured Image */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            <span style={styles.labelIcon}>🖼️</span> Featured Image
            <span style={styles.optional}>(Optional)</span>
          </label>
          {!imagePreview ? (
            <label style={styles.uploadBox}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <div style={styles.uploadContent}>
                <div style={styles.uploadIcon}>📁</div>
                <p style={styles.uploadText}>
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p style={styles.uploadHint}>PNG, JPG, GIF up to 5MB</p>
              </div>
            </label>
          ) : (
            <div style={styles.imagePreviewContainer}>
              <img
                src={imagePreview}
                alt="Preview"
                style={styles.imagePreview}
              />
              <button
                type="button"
                onClick={removeImage}
                style={styles.removeImageBtn}
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            <span style={styles.labelIcon}>📝</span> Content
          </label>
          <div style={styles.quillWrapper}>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Write your amazing post here..."
              style={styles.quillEditor}
            />
          </div>
          <div style={styles.editorFooter}>
            <span>📊 {wordCount} words</span>
          </div>
        </div>

        <div style={styles.actionButtons}>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={styles.cancelBtn}
            disabled={loading}
          >
            ← Cancel
          </button>
          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...(loading && styles.submitBtnDisabled),
            }}
            disabled={loading}
          >
            {loading
              ? "⏳ Publishing..."
              : post
                ? "💾 Update Post"
                : "🚀 Publish Post"}
          </button>
        </div>
      </form>
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
  formCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    padding: "40px",
    width: "100%",
    maxWidth: "900px",
  },
  formHeader: {
    textAlign: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #f0f0f0",
  },
  formTitle: {
    fontSize: "2em",
    color: "#1A4D5C",
    margin: "0 0 8px 0",
    fontWeight: "600",
  },
  formSubtitle: { color: "#666", margin: 0, fontSize: "0.95em" },
  errorBox: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #fcc",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  errorIcon: { fontSize: "1.2em" },
  fieldGroup: { marginBottom: "25px", position: "relative" },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
    color: "#333",
    fontWeight: "600",
    fontSize: "0.95em",
  },
  labelIcon: { fontSize: "1.1em" },
  optional: {
    color: "#999",
    fontWeight: "400",
    fontSize: "0.85em",
    marginLeft: "5px",
  },
  titleInput: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "1.1em",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  charCount: {
    position: "absolute",
    right: "10px",
    bottom: "-20px",
    fontSize: "0.75em",
    color: "#999",
  },
  uploadBox: {
    display: "block",
    border: "2px dashed #ccc",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#fafafa",
  },
  uploadContent: { pointerEvents: "none" },
  uploadIcon: { fontSize: "3em", marginBottom: "10px" },
  uploadText: { color: "#555", margin: "5px 0" },
  uploadHint: { color: "#999", fontSize: "0.85em" },
  imagePreviewContainer: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    border: "2px solid #e0e0e0",
  },
  imagePreview: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    display: "block",
  },
  removeImageBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "8px 14px",
    backgroundColor: "rgba(220, 53, 69, 0.95)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9em",
    fontWeight: "500",
  },
  quillWrapper: {
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  quillEditor: {
    height: "300px",
    marginBottom: "50px",
  },
  editorFooter: {
    marginTop: "8px",
    fontSize: "0.85em",
    color: "#666",
    textAlign: "right",
  },
  actionButtons: {
    display: "flex",
    gap: "15px",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "2px solid #f0f0f0",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    padding: "12px 28px",
    backgroundColor: "transparent",
    color: "#666",
    border: "2px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95em",
    fontWeight: "500",
  },
  submitBtn: {
    padding: "12px 32px",
    backgroundColor: "#FF6B35",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
  },
  submitBtnDisabled: {
    backgroundColor: "#999",
    cursor: "not-allowed",
    boxShadow: "none",
  },
};

export default PostForm;
