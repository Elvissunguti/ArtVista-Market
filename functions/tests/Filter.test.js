const request = require("supertest");
const express = require("express");
const passport = require("passport");
const ArtWork = require("../Model/ArtWork");
const User = require("../Model/User");
const router = require("../");  

// Mock Passport
jest.mock("passport", () => ({
    authenticate: jest.fn().mockImplementation((strategy, options) => (req, res, next) => {
      console.log("Passport authenticate called"); // Add this for debugging
      next(); // Continue the request pipeline
    })
  }));

// Mock Models
jest.mock("../Model/ArtWork");
jest.mock("../Model/User");

const app = express();
app.use(express.json());
app.use(router);

describe("GET /all", () => {
  let user;
  let artworks;

  beforeEach(() => {
    user = { _id: "userId", userName: "testUser" };
    artworks = [
      {
        _id: "artwork1",
        title: "Artwork 1",
        price: 1000,
        artPhoto: ["photo1.jpg"],
        size: "Small",
        category: "Abstract",
        medium: "Oil",
        surface: "Canvas",
        artType: "Painting",
        creationYear: 2020,
        quality: "High",
        delivery: "Free",
        description: "Description 1",
        isSold: false,
      },
      {
        _id: "artwork2",
        title: "Artwork 2",
        price: 1500,
        artPhoto: ["photo2.jpg"],
        size: "Medium",
        category: "Landscape",
        medium: "Watercolor",
        surface: "Paper",
        artType: "Painting",
        creationYear: 2021,
        quality: "Medium",
        delivery: "Paid",
        description: "Description 2",
        isSold: true,
      },
    ];
  });

  it("should return filtered artworks for a specific user", async () => {
    User.findOne.mockResolvedValue(user);
    ArtWork.find.mockResolvedValue(artworks);

    const response = await request(app)
      .get("/all?userName=testUser")
      .set("Authorization", "Bearer token"); // Mock JWT token if necessary

    expect(response.status).toBe(200);
    expect(response.body.data.simplifiedArtwork).toHaveLength(2);
    expect(response.body.data.simplifiedArtwork[0]).toHaveProperty("title", "Artwork 1");
    expect(response.body.data.mediumCounts).toHaveLength(2);
    expect(response.body.data.surfaceCounts).toHaveLength(2);
    expect(response.body.data.categoryCounts).toHaveLength(2);
  });

  it("should return an error if the user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get("/all?userName=testUser")
      .set("Authorization", "Bearer token");

    expect(response.status).toBe(200);
    expect(response.body.error).toBe("User not found");
  });

  it("should return all artworks when no userName is provided", async () => {
    ArtWork.find.mockResolvedValue(artworks);

    const response = await request(app)
      .get("/all")
      .set("Authorization", "Bearer token");

    expect(response.status).toBe(200);
    expect(response.body.data.simplifiedArtwork).toHaveLength(2);
    expect(response.body.data.mediumCounts).toHaveLength(2);
    expect(response.body.data.surfaceCounts).toHaveLength(2);
    expect(response.body.data.categoryCounts).toHaveLength(2);
  });

  it("should return an error when an exception is thrown", async () => {
    User.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/all?userName=testUser")
      .set("Authorization", "Bearer token");

    expect(response.status).toBe(200);
    expect(response.body.error).toBe("Error fetching artwork according to the filter");
  });
});
