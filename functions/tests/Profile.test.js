const request = require("supertest");
const express = require("express");
const passport = require("passport");
const Profile = require("../Model/Profile");
const User = require("../Model/User");
const ProfileRoutes = require("../routes/Profile");
const jwt = require("jsonwebtoken"); // To generate mock JWT token
const { default: mongoose } = require("mongoose");

jest.setTimeout(30000); // Global timeout for all tests

describe("Profile Routes", () => {
  let app;
  let mockJwtToken;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/profile", ProfileRoutes);
    
    // Generate a mock JWT token
    mockJwtToken = jwt.sign({ _id: "mockUserId" }, "your-secret-key");
    
    // Spy on passport.authenticate to track calls
    jest.spyOn(passport, "authenticate");
  });

  beforeEach(async () => {
    // Clean up the database before each test
    await Profile.deleteMany({});
    await User.deleteMany({});
    jest.clearAllMocks(); // Ensure spies are cleared between tests
  });

  describe("POST /profile/create", () => {
    it("creates a new profile", async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userName: "Test User",
        email: "test@example.com",
        password: "hashed-password123"
      });
      await user.save();

      const response = await request(app)
        .post("/profile/create")
        .set("Authorization", `Bearer ${mockJwtToken}`)
        .send({ description: "Test Description", location: "Test Location", profilePic: "profile-pic-url" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Profile created successfully");

      const profile = await Profile.findOne({ userId: user._id });
      expect(profile).toBeTruthy();
      expect(profile.description).toBe("Test Description");
      expect(profile.location).toBe("Test Location");
    });

    it("updates an existing profile", async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userName: "Test User",
        email: "test@example.com",
        password: "hashed-password123"
      });
      await user.save();

      const existingProfile = new Profile({
        userId: new mongoose.Types.ObjectId(),
        description: "Old Description",
        location: "Old Location",
        profilePic: "old-pic-url"
      });
      await existingProfile.save();

      const response = await request(app)
        .post("/profile/create")
        .set("Authorization", `Bearer ${mockJwtToken}`)
        .send({ description: "Updated Description", location: "Updated Location", profilePic: "updated-pic-url" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Profile updated successfully");

      const updatedProfile = await Profile.findOne({ userId: "mockUserId" });
      expect(updatedProfile.description).toBe("Updated Description");
      expect(updatedProfile.location).toBe("Updated Location");
      expect(updatedProfile.profilePic).toBe("updated-pic-url");
    });

    it("returns error if user is not authenticated", async () => {
      const response = await request(app)
        .post("/profile/create")
        .send({ description: "Test Description", location: "Test Location", profilePic: "profile-pic-url" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });
  });

  describe("GET /profile/get/profile", () => {
    it("returns the profile for the authenticated user", async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userName: "Test User",
        email: "test@example.com",
        password: "hashed-password123"
      });
      await user.save();

      const profile = new Profile({
        userId: new mongoose.Types.ObjectId(),
        description: "Test Description",
        location: "Test Location",
        profilePic: "profile-pic-url"
      });
      await profile.save();

      const response = await request(app)
        .get("/profile/get/profile")
        .set("Authorization", `Bearer ${mockJwtToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.description).toBe("Test Description");
      expect(response.body.data.location).toBe("Test Location");
    });

    it("returns 404 if no profile exists for the user", async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userName: "Test User",
        email: "test@example.com",
        password: "hashed-password123"
      });
      await user.save();

      const response = await request(app)
        .get("/profile/get/profile")
        .set("Authorization", `Bearer ${mockJwtToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Error fetching user's profile");
    });

    it("returns error if user is not authenticated", async () => {
      const response = await request(app)
        .get("/profile/get/profile");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthorized");
    });
  });

  describe("GET /profile/:artistId", () => {
    it("returns the profile of a specific artist", async () => {
      const artist = new User({
        _id:  new mongoose.Types.ObjectId(),
        userName: "Artist User",
        email: "artist@example.com",
        password: "hashed-password123"
      });
      await artist.save();

      const profile = new Profile({
        userId: new mongoose.Types.ObjectId(),
        description: "Artist Description",
        location: "Artist Location",
        profilePic: "artist-profile-pic-url"
      });
      await profile.save();

      const response = await request(app)
        .get("/profile/artistId")
        .set("Authorization", `Bearer ${mockJwtToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.userName).toBe("Artist User");
      expect(response.body.data.profilePic).toBe("artist-profile-pic-url");
    });

    it("returns error if artist profile doesn't exist", async () => {
      const response = await request(app)
        .get("/profile/nonexistentArtistId")
        .set("Authorization", `Bearer ${mockJwtToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Error fetching profile of the artist");
    });
  });
});
