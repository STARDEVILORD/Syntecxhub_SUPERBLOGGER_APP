const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ msg: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const comment = await Comment.create({
      content: content.trim(),
      author: req.user._id,
      post: req.params.postId,
    });

    post.commentsCount = await Comment.countDocuments({
      post: req.params.postId,
    });
    await post.save();
    await comment.populate("author", "name email");

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const isCommentAuthor =
      comment.author.toString() === req.user._id.toString();
    const isPostOwner = post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostOwner) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    post.commentsCount = await Comment.countDocuments({
      post: req.params.postId,
    });
    await post.save();

    res.json({ msg: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
