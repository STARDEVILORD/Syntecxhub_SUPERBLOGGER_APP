const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getUserPosts,
} = require("../controllers/postController");

router.get("/user/:userId", auth, getUserPosts);
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/like", auth, toggleLike);

module.exports = router;
