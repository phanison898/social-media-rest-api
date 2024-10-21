import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
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
