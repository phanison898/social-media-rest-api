import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import connectDB from "../config/db";

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const email = faker.internet.email();
const password = faker.internet.password();
const profilePicture = "http://example.com/profile.jpg";

let token;
let userId;
let postId;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {});

afterEach(async () => {});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User routes /api/auth/", () => {
  it("should sign up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      firstName,
      lastName,
      email,
      password,
      profilePicture,
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should log in an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    token = res.body.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId;

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should update an existing user", async () => {
    const res = await request(app)
      .patch(`/api/auth/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "phanison",
        lastName: "potturi",
      });

    expect(res.statusCode).toEqual(200);
  });
});

describe("Post routes /api/posts/", () => {
  it("should create a post", async () => {
    const res = await request(app)
      .post("/api/posts/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId,
        description: "excuse me",
        mediaType: "image",
        mediaUrl: "http://localhost",
        likes: [],
        comments: [],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("mediaType");
    expect(res.body).toHaveProperty("mediaUrl");
    expect(res.body).toHaveProperty("likes");
    expect(res.body).toHaveProperty("comments");

    postId = res.body.id;
  });

  it("should read a post", async () => {
    const res = await request(app)
      .get(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("mediaType");
    expect(res.body).toHaveProperty("mediaUrl");
    expect(res.body).toHaveProperty("likes");
    expect(res.body).toHaveProperty("comments");
  });

  it("should update a post", async () => {
    const res = await request(app)
      .patch(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "my name is guru",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("mediaType");
    expect(res.body).toHaveProperty("mediaUrl");
    expect(res.body).toHaveProperty("likes");
    expect(res.body).toHaveProperty("comments");
  });

  it("should like a post", async () => {
    const res = await request(app)
      .patch(`/api/posts/${postId}/like`)
      .set("Authorization", `Bearer ${token}`)
      .send({ userId });

    expect(res.statusCode).toBe(200);
    console.log("res.body.post.likes.length = " + res.body.post.likes.length);
    expect(res.body.post.likes.length).toBe(1);
  });

  it("should unlike a post", async () => {
    const res = await request(app)
      .patch(`/api/posts/${postId}/unlike`)
      .set("Authorization", `Bearer ${token}`)
      .send({ userId });

    expect(res.statusCode).toBe(200);
    console.log("res.body.post.likes.length = " + res.body.post.likes.length);
    expect(res.body.post.likes.length).toBe(0);
  });

  it("should read all posts", async () => {
    const res = await request(app).get(`/api/posts/`).set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("should delete a post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });
});
