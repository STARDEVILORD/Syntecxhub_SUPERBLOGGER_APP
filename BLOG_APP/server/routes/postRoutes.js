const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  getUserPosts,
} = require("../controllers/postController");

// ⚠️ IMPORTANT: User posts route BEFORE /:id
router.get("/user/:userId", auth, getUserPosts);

router.get("/", getPosts);
router.get("/:id", getPost);

// ⚠️ Make sure createPost has auth middleware
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/like", auth, toggleLike);

module.exports = router;
