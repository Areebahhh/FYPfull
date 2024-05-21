import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
 import cors from "cors";
 import multer from "multer";
 import cookieParser from "cookie-parser";
import storiesRoutes from "./routes/storiesRoutes.js"
import messagesRoutes from "./routes/messagesRoutes.js"
import conversationsRoutes from "./routes/conversationsRoutes.js"
import appliedJobRoutes from "./routes/appliedJobRoutes.js"
import interviewRoutes from "./routes/interviewRoutes.js"
import savePostsRoutes from "./routes/savePostsRoutes.js"
import notificationsRoutes from "./routes/notificationsRoutes.js"
import portfolioRoutes from "./routes/portfolioRoutes.js"
import adminworkRoutes from "./routes/adminworkRoutes.js"


//middlewares

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);

  next();
});

 app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

 app.use(cookieParser());

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // cb(null, "../client/public/upload");
//     cb(null, "../Frontend/public/upload");
    
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });


import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'Frontend', 'public', 'upload');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

 app.use("/api/auth", authRoutes);
 app.use("/api/users", userRoutes);
 app.use("/api/posts", postRoutes);
 app.use("/api/comments", commentRoutes);
 app.use("/api/likes", likeRoutes);
 app.use("/api/relationships", relationshipRoutes);
 app.use("/api/stories", storiesRoutes);
 app.use("/api/messages", messagesRoutes);
 app.use("/api/conversations", conversationsRoutes);
 app.use("/api/jobs", appliedJobRoutes);
 app.use("/api/interviews", interviewRoutes);
 app.use("/api/savePosts", savePostsRoutes);
 app.use("/api/notifications", notificationsRoutes);
 app.use("/api/portfolio", portfolioRoutes);
 app.use("/api/ad", portfolioRoutes);
 app.use("/api/adminwork", adminworkRoutes)



app.listen(8800, () => {
  console.log("API working!");
});
