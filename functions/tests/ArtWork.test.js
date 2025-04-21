const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Import the router
const artworkRouter = require("../routes/artworkRoutes");

// Mock Models
jest.mock("../Model/ArtWork");
jest.mock("../Model/User");

const ArtWork = require("../Model/ArtWork");
const User = require("../Model/User");

// Create Express app and use passport and router
const app = express();
app.use(express.json());

// Mock passport to bypass real authentication
app.use(passport.initialize());
passport.authenticate = jest.fn(() => (req, res, next) => next());

// Apply the artwork route
app.use("/api/artwork", artworkRouter);

// Sample token creation function (skip real signing logic in test)
const mockToken = "mock.jwt.token";

describe("GET /api/artwork/all", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return artworks for a specific user", async () => {
    const mockUser = { _id: "user1", userName: "artist1" };
    const mockArtworks = [
      {
        _id: "art1",
        title: "Art 1",
        price: 1000,
        artPhoto: ["url1"],
        size: "Large",
        category: "Portrait",
        medium: "Oil",
        surface: "Canvas",
        artType: "Painting",
        creationYear: 2022,
        quality: "High",
        delivery: "Yes",
        description: "Nice",
        isSold: false
      }
    ];

    User.findOne.mockResolvedValue(mockUser);
    ArtWork.find.mockResolvedValue(mockArtworks);

    const res = await request(app)
      .get("/api/artwork/all")
      .set("Authorization", `Bearer ${mockToken}`)
      .query({ userName: "artist1" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.simplifiedArtwork.length).toBe(1);
    expect(res.body.data.mediumCounts[0].medium).toBe("Oil");
  });

  it("should return artworks by filter without userName", async () => {
    const mockArtworks = [
      {
        _id: "art2",
        title: "Art 2",
        price: 2000,
        artPhoto: ["url2"],
        size: "Medium",
        category: "Landscape",
        medium: "Acrylic",
        surface: "Paper",
        artType: "Sketch",
        creationYear: 2023,
        quality: "High",
        delivery: "Yes",
        description: "Great",
        isSold: true
      }
    ];

    ArtWork.find.mockResolvedValue(mockArtworks);

    const res = await request(app)
      .get("/api/artwork/all")
      .set("Authorization", `Bearer ${mockToken}`)
      .query({ medium: "Acrylic" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.simplifiedArtwork.length).toBe(1);
    expect(res.body.data.mediumCounts[0].medium).toBe("Acrylic");
  });

  it("should return error when user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/artwork/all")
      .set("Authorization", `Bearer ${mockToken}`)
      .query({ userName: "unknown" });

    expect(res.statusCode).toBe(200);
    expect(res.body.error).toBe("User not found");
  });

  it("should handle server error", async () => {
    User.findOne.mockRejectedValue(new Error("Something broke"));

    const res = await request(app)
      .get("/api/artwork/all")
      .set("Authorization", `Bearer ${mockToken}`)
      .query({ userName: "errorUser" });

    expect(res.statusCode).toBe(200);
    expect(res.body.error).toBe("Error fetching artwork according to the filter");
  });
});
