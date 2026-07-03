import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "../contexts/AuthContext";

const PostForm = ({ post, onSubmit, loading }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const quillRef = useRef(null);
  const [title, setTitle] = useState(post ? post.title : "");
  const [content, setContent] = useState(post ? post.content : "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post ? post.imageUrl : "");
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
    []
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
    if (image) {
      formData.append("image", image);
    }

    console.log("Submitting:", { title, content: content.substring(0, 50) });

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to save post");
    }
  };

  const wordCount = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={styles.pageWrapper}>
      <form onSubmit={handleSubmit} style={styles.formCard}>
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>
            {post ? "Edit Post" : "Create New Post"}
          </h2>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span>Warning: </span> {error}
          </div>
        )}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title..."
            style={styles.titleInput}
            maxLength="200"
            required
            disabled={loading}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Featured Image (Optional)</label>
          {!imagePreview ? (
            <label style={styles.uploadBox}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                disabled={loading}
              />
              <div style={styles.uploadContent}>
                <div style={styles.uploadIcon}>Upload</div>
                <p>Click to upload image</p>
              </div>
            </label>
          ) : (
            <div style={styles.imagePreviewContainer}>
              <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
              <button type="button" onClick={removeImage} style={styles.removeImageBtn}>
                Remove
              </button>
            </div>
          )}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Content</label>
          <div style={styles.quillWrapper}>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Write your post..."
              style={styles.quillEditor}
            />
          </div>
          <div style={styles.editorFooter}>{wordCount} words</div>
        </div>

        <div style={styles.actionButtons}>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={styles.cancelBtn}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{ ...styles.submitBtn, ...(loading && styles.submitBtnDisabled) }}
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Post"}
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
    margin: 0,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #fcc",
  },
  fieldGroup: {
    marginBottom: "25px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#333",
    fontWeight: "600",
    fontSize: "0.95em",
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
  uploadBox: {
    display: "block",
    border: "2px dashed #ccc",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#fafafa",
  },
  uploadContent: {
    pointerEvents: "none",
  },
  uploadIcon: {
    fontSize: "2em",
    marginBottom: "10px",
  },
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
    padding: "8px 14px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
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
  },
  submitBtn: {
    padding: "12px 32px",
    backgroundColor: "#FF6B35",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  submitBtnDisabled: {
    backgroundColor: "#999",
    cursor: "not-allowed",
  },
};

export default PostForm;
