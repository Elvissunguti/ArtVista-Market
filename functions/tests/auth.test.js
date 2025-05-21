const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const AuthRoutes = require("../routes/Auth");
const User = require("../Model/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { getToken, invalidateToken } = require("../Utils/Helpers");
const { mockUserId } = require("./setup");

jest.setTimeout(30000); // Global timeout for all tests

describe("Auth Routes", () => {
  let app;

  beforeAll(() => {
    // Spy on passport.authenticate to track calls while retaining its behavior
    jest.spyOn(passport, "authenticate");

    app = express();
    app.use(express.json());
    app.use("/auth", AuthRoutes);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks(); // Ensure spies are cleared between tests
  });

  describe("POST /auth/signup", () => {
    it("creates a new user and returns a token", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .send({ userName: "Test User", email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User created Successfully");
      expect(response.body.token).toBe("mock-jwt-token-test@example.com");

      const user = await User.findOne({ email: "test@example.com" });
      expect(user).toBeTruthy();
      expect(user.userName).toBe("Test User");

      // ✅ Proper way to check hashed password
      const isMatch = await bcrypt.compare("password123", user.password);
      expect(isMatch).toBe(true);
    }, 10000);

    it("returns error for existing email", async () => {
      await new User({
        userName: "Test User",
        email: "test@example.com",
        password: "hashed-password123"
      }).save();

      const response = await request(app)
        .post("/auth/signup")
        .send({ userName: "Another User", email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User with this email already exist");
    }, 10000);
  });

  describe("POST /auth/login", () => {
    it("logs in with valid credentials", async () => {
      // hash password before saving manually
      const hashedPassword = await bcrypt.hash("password123", 10);
      await new User({
        userName: "Test User",
        email: "test@example.com",
        password: hashedPassword
      }).save();

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successfull");
      expect(response.body.token).toBe("mock-jwt-token-test@example.com");
    }, 10000);

    it("returns error for invalid password", async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await new User({
        userName: "Test User",
        email: "test@example.com",
        password: hashedPassword
      }).save();

      const response = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password does not match");
    }, 10000);

    it("returns error for non-existent email", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "nonexistent@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("email not found");
    }, 10000);
  });

  describe("POST /auth/logout", () => {
    it("logs out successfully with valid token", async () => {
      const response = await request(app)
        .post("/auth/logout")
        .set("Authorization", "mock-jwt-token");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logout successful");
      expect(invalidateToken).toHaveBeenCalledWith("mock-jwt-token");
    }, 10000);

    it("returns 401 for invalid token", async () => {
      const response = await request(app)
        .post("/auth/logout")
        .set("Authorization", "invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid token");
    }, 10000);
  });

  describe("GET /auth/userId", () => {
    it("returns user data with valid JWT", async () => {
      await new User({
        _id: mockUserId,
        userName: "Test User",
        email: "test@example.com",
        password: "hashed-password123"
      }).save();

      const response = await request(app)
        .get("/auth/userId")
        .set("Authorization", "Bearer mock-jwt-token");

      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(mockUserId);
      expect(response.body.data.userName).toBe("Test User");
    }, 10000);

    it("returns 404 for non-existent user", async () => {
      const response = await request(app)
        .get("/auth/userId")
        .set("Authorization", "Bearer mock-jwt-token");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("User not found");
    }, 10000);
  });

  describe("GET /auth/google", () => {
    it("initiates Google OAuth flow", async () => {
      const response = await request(app).get("/auth/google");
      expect(response.status).not.toBe(500);
    }, 10000);
  });

  describe("GET /auth/google/callback", () => {
    it("handles Google callback with new user", async () => {
      const response = await request(app).get("/auth/google/callback");

      expect(response.status).toBe(302);
      expect(response.header.location).toContain("codecrafter-s-corner.web.app/Blog?token=mock-jwt-token-test@example.com");

      const user = await User.findOne({ email: "test@example.com" });
      expect(user).toBeTruthy();
      expect(user.userName).toBe("Test User");
    }, 10000);

    it("handles Google callback with existing user", async () => {
      await new User({
        email: "test@example.com",
        userName: "Test User",
        password: "hashed-password123"
      }).save();

      const response = await request(app).get("/auth/google/callback");

      expect(response.status).toBe(302);
      expect(response.header.location).toContain("codecrafter-s-corner.web.app/Blog?token=mock-jwt-token-test@example.com");
    }, 10000);
  });
});
