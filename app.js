import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./api/users.js";
import postRoutes from "./api/posts.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);

if (process.env.NODE_ENV !== "test") {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
