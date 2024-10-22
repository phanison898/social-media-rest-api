import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { AvatarGenerator } from "random-avatar-generator";

const generator = new AvatarGenerator();

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: generator.generateRandomAvatar() },
});

const User = mongoose.model("User", userSchema);
export default User;
