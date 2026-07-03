import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import PostForm from "../components/PostForm";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      setFetchLoading(true);
      const { data } = await api.get(`/posts/${id}`);
      setPost(data);
    } catch (err) {
      alert("Failed to load post");
      navigate("/");
    } finally {
      setFetchLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
      await api.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Post updated successfully!");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to update post";
      alert("❌ " + msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={styles.loading}>
        <h2 style={{ color: "white" }}>Loading post...</h2>
      </div>
    );
  }

  return <PostForm post={post} onSubmit={handleUpdate} loading={loading} />;
};

const styles = {
  loading: {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default EditPostPage;
