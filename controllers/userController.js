import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// 1. Create user (sign up)
export const signup = async (req, res) => {
  if (!req.body) return res.status(404).json({ message: "No user data provided" });

  const { firstName, lastName, email, password, profilePicture } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePicture,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error signing up user", error });
  }
};

// 2. User Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// 3. Get all users from db
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

// 4. Get User by ID
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// 5. Update User by ID
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, profilePicture } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { id },
      { firstName, lastName, profilePicture },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// 6. Deele User by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findOneAndDelete({ id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
