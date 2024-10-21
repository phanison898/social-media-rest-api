import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likeOrUnLikeAPost,
} from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);
router.get("/:id", authMiddleware, getPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:postId/like", authMiddleware, likeOrUnLikeAPost);

export default router;
