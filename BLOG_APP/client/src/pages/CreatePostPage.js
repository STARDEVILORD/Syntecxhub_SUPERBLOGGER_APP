import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PostForm from "../components/PostForm";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (formData) => {
    setLoading(true);
    setError("");
    try {
      console.log("📤 Creating post...");
      const response = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ Post created:", response.data);
      alert("✅ Post created successfully!");
      navigate("/");
    } catch (err) {
      console.error("❌ Create error:", err);
      const msg = err.response?.data?.msg || "Failed to create post";
      setError(msg);
      alert("❌ " + msg);
    } finally {
      setLoading(false);
    }
  };
  return <PostForm onSubmit={handleCreate} loading={loading} />;
};

export default CreatePostPage;
