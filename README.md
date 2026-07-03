# 📝 Syntecxhub_SUPERBLOGGER_APP

Full-stack MERN application for creating, publishing, and managing blog posts with user authentication, rich text editing, and social engagement features.

Create an account to start sharing your stories, or browse posts from other writers in the community.

---

## 📌 Overview

This project demonstrates an end-to-end full-stack web application built with JavaScript. It:

- Manages user authentication (registration and secure login) using encrypted passwords and JWT tokens.
- Provides a personalized blog feed to Create, Edit, and Delete posts with rich text formatting and image uploads.
- Features interactive Like and Comment systems for social engagement between writers and readers.
- Includes customizable user profiles with display pictures, cover photos, bio, gender, date of birth, and hobbies.
- Connects a React frontend to a Node.js/Express backend via RESTful APIs.
- Stores all user, post, and engagement data securely in a MongoDB database.

This project was developed to gain hands-on experience in full-stack web development, database management, and building real-world blogging platforms.

---

## 🚀 Features

- 👤 **User Registration & Secure Authentication** (JWT + bcrypt)
- ✍️ **Rich Text Editor** for creating beautiful blog posts
- 🖼️ **Image Upload** for featured images in posts
- ❤️ **Like System** to like/unlike posts
- 💬 **Comment System** to add and delete comments
- 👥 **User Profiles** with DP, cover photo, bio, gender, DOB, and hobbies
- 🎨 **Beautiful Landing Page** with hero video and features showcase
- 📱 **Responsive Design** that works on all devices
- 🔒 **Protected Routes** for authenticated users only
- 🎯 **Post Preview** before publishing
- 📊 **User Stats** showing posts count and engagement

---

## 🛠 Technologies Used

| Frontend                           | Backend            | Database & Storage             |
| :--------------------------------- | :----------------- | :----------------------------- |
| **React.js** (with React Router)   | **Node.js**        | **MongoDB** & Mongoose         |
| **React Quill** (Rich Text Editor) | **Express.js**     | **Cloudinary** (Image Storage) |
| **Axios**                          | **JWT** & bcryptjs | **Multer** (File Upload)       |
| **Custom CSS**                     | Custom Middleware  |                                |

---

## 📂 Project Structure

```text
Syntecxhub_SUPERBLOGGER_APP/
├── client/                     # React frontend
│   ├── public/                 # Static assets (favicon, images)
│   │   └── assets/             # Logo, backgrounds, default DPs
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout.js       # Main layout with Navbar & Footer
│   │   │   ├── Navbar.js       # Top navigation bar
│   │   │   ├── Footer.js       # Bottom footer
│   │   │   ├── PostForm.js     # Create/Edit post form
│   │   │   └── ProtectedRoute.js # Auth guard component
│   │   ├── pages/              # Page components
│   │   ├── contexts/           # React contexts
│   │   ├── services/           # API services (Axios)
│   │   ├── App.js              # Main app component
│   │   └── index.js            # Entry point
│   └── package.json
├── server/                     # Node.js backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Route handlers
│   ├── models/                 # Mongoose schemas (User, Post, Comment)
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware (JWT verification)
│   ├── utils/                  # Utilities (Cloudinary config)
│   ├── .env                    # Environment variables
│   ├── server.js               # Main server entry
│   └── package.json
├── README.md
└── LICENSE

```

---

## ⚙️ Setup

Clone the repository to your local machine:

```bash
git clone [https://github.com/YOUR_USERNAME/Syntecxhub_SUPERBLOGGER_APP.git](https://github.com/YOUR_USERNAME/Syntecxhub_SUPERBLOGGER_APP.git)
cd Syntecxhub_SUPERBLOGGER_APP

```

**1. Setup the Server**

```bash
cd server
npm install

```

**2. Configure Environment Variables**
Create a `.env` file in the `server` folder and add the following:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000

```

**3. Setup the Client**

```bash
cd ../client
npm install

```

**4. Create Required Asset Folders**
Create an `assets` folder in `client/public`:

```bash
mkdir client/public/assets

```

_Add these image files (or use placeholders):_

- `logo.png` - Navbar logo
- `default-dp.png`, `default-dp-male.png`, `default-dp-female.png` - Profile pictures
- `default-cover.jpg` - Profile cover
- `home-bg.jpg` - Home page background
- `background.mp4` - Landing page video

---

## ▶️ Usage

You will need two terminal windows open to run the full stack locally.

**Terminal 1 (Server):**

```bash
cd server
npm run dev

```

**Terminal 2 (Client):**

```bash
cd client
npm start

```

_React will start the frontend on `http://localhost:3000_`

This opens a browser tab with the web app. You can:

- 📝 **Register** a new account
- 🔐 **Login** with your credentials
- ✍️ **Create** blog posts with rich text and images
- ❤️ **Like** and 💬 **comment** on posts
- 👤 **Customize** your profile with DP, cover photo, and bio
- 🗑️ **Edit or delete** your own posts
- 📱 Enjoy the responsive design on any device

---

## 🧠 How It Works

- **Frontend:** Built with React, the UI manages authentication state and renders the blog feed, post details, and user profiles. Axios intercepts requests to attach a secure JWT token to the headers for protected API calls.
- **Authentication:** When a user registers, bcryptjs scrambles their password before saving it to MongoDB. Upon login, the server issues a timed JSON Web Token that validates the user for 7 days.
- **Backend API:** Express handles routing with a custom authentication middleware that acts as a "bouncer," checking incoming requests for valid tokens before allowing access to protected routes like creating posts, liking, or commenting.
- **Rich Text Editor:** React Quill provides a powerful WYSIWYG editor for creating formatted blog posts with bold, italic, lists, links, and images.
- **Image Upload:** When a user uploads a featured image for a post or profile picture, it's sent to the backend, uploaded to Cloudinary for cloud storage, and the returned URL is stored in MongoDB.
- **Database:** MongoDB stores data in three main collections (Users, Posts, Comments), automatically linking posts and comments to the specific user IDs that created them.
- **Social Features:** Likes are stored as arrays of user IDs within each post document. Comments are stored as separate documents with references to both the post and the comment author.

---

## 🌟 Key Features Explained

### ✍️ Rich Text Editor

Create beautiful blog posts with formatting tools including bold, italic, lists, links, and more using React Quill.

### 👥 User Profiles

Customize your profile with:

- Display picture (upload or gender-based default)
- Cover photo
- Bio
- Gender, Date of Birth, Hobbies
- Edit anytime with the "Edit" button

### 🤝 Social Engagement

- Like posts with a single click - heart icon shows liked state
- Comment on posts to start discussions
- View counts of likes and comments on each post

### 🎨 Beautiful Landing Page

- Full-screen background video
- Floating animated elements
- Feature showcase section
- "Echoes of the Hearts" inspirational section
- Call-to-action sections

---

## 👤 Author

**Shriram** _B.Sc. Computer Science Graduate | Software Developer | Full-Stack Web Developer_

## 📄 License

This project is licensed under the terms of the MIT License.
