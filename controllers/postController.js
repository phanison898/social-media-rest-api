import Post from "../models/postModel.js";

// 0. Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts", error });
  }
};

// 1. Create Post
export const createPost = async (req, res) => {
  const { description, mediaType, mediaUrl } = req.body;
  const userId = req.user.userId; // we can get it from authMiddleware

  try {
    const newPost = new Post({
      userId,
      description,
      mediaType,
      mediaUrl,
      likes: [], // likes are empty by default
      comments: [], // comments are empty by default
    });
    await newPost.save(); // post is saved to DB
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// 2. Get post by ID
export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findOne({ id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving post", error });
  }
};

// 3. Update post by ID
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { description, mediaType, mediaUrl } = req.body;
  try {
    const post = await Post.findOneAndUpdate(
      { id },
      { description, mediaType, mediaUrl },
      { new: true }
    );
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

// 4. Delet post by ID
export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findOneAndDelete({ id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

// 5. Like or Unlike a Post
export const likeOrUnLikeAPost = async (req, res) => {
  const { postId, action } = req.params;
  const { userId } = req.body;

  try {
    // Find post by ID
    const post = await Post.findOne({ id: postId }); // this peice of shit costed me one hour. use findOne() never use findById()

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user has already liked the post
    const userIndex = post.likes.indexOf(userId);

    if (action == "like" && !(userIndex > -1)) {
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully", post });
    }

    if (action == "unlike" && userIndex > -1) {
      post.likes.splice(userIndex, 1); // Remove userId from likes array
      await post.save();
      res.status(200).json({ message: "Post unliked successfully", post });
    }
  } catch (error) {
    res.status(500).json({ message: "Error liking/unliking the post", error });
  }
};
