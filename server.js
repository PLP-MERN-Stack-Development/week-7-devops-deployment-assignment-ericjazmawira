import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
import forgotPasswordRouter from "./routes/forgotPassword.js";

// App config
dotenv.config();
const app = express();
const port = process.env.PORT || 8001;
mongoose.set("strictQuery", true);

// Middleware
app.use(express.json());
app.use(cors());

// DB config
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("✅ MongoDB connected");
  }
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
app.use("/api/forgotPassword", forgotPasswordRouter);

// === Serve frontend in production === //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

// Start server
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`));
