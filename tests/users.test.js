import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/userModel.js";
import connectDB from "../config/db.js";
import bcrypt from "bcrypt";

// Connect to a new in-memory test database before running any tests
beforeAll(async () => {
  connectDB();
});

// Clean up the test database after each test
afterEach(async () => {
  await User.deleteMany();
});

// Close the database connection after all tests are done
afterAll(async () => {
  await mongoose.connection.close();
});

describe("User API", () => {
  it("should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      firstName: "bharu",
      lastName: "Kumar",
      email: "bharu@gmail.com",
      password: "password123",
      profilePicture: "http://example.com/profile.jpg",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should log in an existing user", async () => {
    // First, create a user
    const user = new User({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: await bcrypt.hash("password123", 10),
      profilePicture: "http://example.com/profile.jpg",
    });
    await user.save();

    // Attempt to log in
    const res = await request(app).post("/api/auth/login").send({
      email: "jane.doe@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not log in with invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "invalid.email@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });
});
