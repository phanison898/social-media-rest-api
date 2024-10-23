import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./api/users.js";
import postRoutes from "./api/posts.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://phanison-social-media-rest-api.onrender.com"], // Allow requests only from this origin
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    credentials: true, // Allow cookies to be sent
  })
);
app.use("/api/auth", userRoutes);
app.use("/api/posts", postRoutes);

if (process.env.NODE_ENV !== "test") {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
