import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const postSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  userId: { type: String, required: true },
  description: { type: String },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  mediaUrl: { type: String, required: true },
  likes: [{ type: String }],
  comments: [
    {
      userId: { type: String, required: true },
      comment: { type: String, required: true },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
export default Post;
