const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email",
    );
    if (!post) return res.status(404).json({ msg: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    console.log("📥 Backend received:");
    console.log("  req.body:", req.body);
    console.log("  req.file:", req.file ? req.file.originalname : "none");

    const { title, content, imageUrl } = req.body;

    // ✅ Validate
    if (!title || !content) {
      console.log("❌ Missing fields. Title:", title, "Content:", content);
      return res.status(400).json({ msg: "Title and content are required" });
    }

    const post = await Post.create({
      title,
      content,
      imageUrl: imageUrl || (req.file ? `/uploads/${req.file.filename}` : ""),
      author: req.user._id,
    });

    await post.populate("author", "name email");
    console.log("✅ Post created:", post._id);
    res.status(201).json(post);
  } catch (error) {
    console.error("❌ Create Post Error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const { title, content, imageUrl } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;
    await post.save();
    await post.populate("author", "name email");
    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    await Comment.deleteMany({ post: req.params.id });
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const userId = req.user._id.toString();
    const likeIndex = post.likes.findIndex((id) => id.toString() === userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }
    post.likesCount = post.likes.length;
    await post.save();

    res.json({ liked: likeIndex === -1, likesCount: post.likesCount });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
