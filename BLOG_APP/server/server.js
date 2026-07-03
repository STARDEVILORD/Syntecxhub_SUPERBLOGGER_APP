const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Load env variables
dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");

connectDB();

const app = express();

// ============================================
// CORS Configuration
// ============================================
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:3000"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token, Origin, Accept",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// ============================================
// Middleware
// ============================================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ============================================
// Test Route
// ============================================
app.get("/", (req, res) => {
  res.json({
    message: "Blog API is running!",
    version: "1.0.0",
    time: new Date(),
    endpoints: {
      auth: "/api/auth",
      posts: "/api/posts",
      users: "/api/users",
    },
  });
});

// ============================================
// API Routes
// ============================================
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);
app.use("/api/users", userRoutes);

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({ msg: `Route not found: ${req.method} ${req.path}` });
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ msg: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
