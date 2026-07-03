const router = require("express").Router({ mergeParams: true });
const auth = require("../middleware/auth");
const {
  getComments,
  addComment,
  deleteComment,
} = require("../controllers/commentController");

router.get("/", getComments);
router.post("/", auth, addComment);
router.delete("/:commentId", auth, deleteComment);

module.exports = router;
