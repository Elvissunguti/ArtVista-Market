const request = require("supertest");
const express = require("express");
const artistRoutes = require("../routes/Artist");
const passport = require("passport");

jest.mock("../Model/User");
jest.mock("../Model/ArtWork");
jest.mock("../Model/Profile");

const User = require("../Model/User");
const ArtWork = require("../Model/ArtWork");
const Profile = require("../Model/Profile");

jest.mock("passport", () => ({
  authenticate: () => (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use("/", artistRoutes);

describe("Artist Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /allartist", () => {
    it("should return artists with artwork counts", async () => {
      ArtWork.distinct.mockResolvedValue(["user1", "user2"]);
      User.find.mockResolvedValue([
        { _id: "user1", userName: "Alice" },
        { _id: "user2", userName: "Bob" }
      ]);
      ArtWork.countDocuments
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(5);

      const res = await request(app).get("/allartist");

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual([
        { artist: "Alice", artWorkCount: 3 },
        { artist: "Bob", artWorkCount: 5 }
      ]);
    });
  });

  describe("GET /get/artist", () => {
    it("should return all artists with profilePic", async () => {
      User.find.mockResolvedValue([
        { _id: "user1", userName: "Alice" },
        { _id: "user2", userName: "Bob" }
      ]);

      Profile.findOne
        .mockResolvedValueOnce({ profilePic: "pic1.jpg" })
        .mockResolvedValueOnce({});

      const res = await request(app).get("/get/artist");

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual([
        { userName: "Alice", profilePic: "pic1.jpg", artistId: "user1" },
        { userName: "Bob", profilePic: null, artistId: "user2" }
      ]);
    });
  });

  describe("GET /profile/:userName", () => {
    it("should return full profile and artworks", async () => {
      User.findOne.mockResolvedValue({ _id: "user1" });

      Profile.findOne.mockResolvedValue({
        profilePic: "pic.jpg",
        location: "Nairobi",
        description: "Artist Bio"
      });

      ArtWork.find.mockResolvedValue([
        {
          _id: "art1",
          title: "Sunset",
          price: 1000,
          artPhoto: ["sunset.jpg"],
          size: "24x36",
          medium: "Oil",
          surface: "Canvas",
          artType: "Painting",
          creationYear: 2022,
          quality: "High",
          delivery: "Free",
          description: "Beautiful sunset",
          isSold: false
        }
      ]);

      const res = await request(app).get("/profile/Alice");

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toMatchObject({
        userName: "Alice",
        userId: "user1",
        profilePic: "pic.jpg",
        location: "Nairobi",
        description: "Artist Bio",
        artworkCount: 1,
        artworks: [
          {
            _id: "art1",
            title: "Sunset",
            price: "1,000",
            artPhoto: "sunset.jpg",
            size: "24x36",
            medium: "Oil",
            surface: "Canvas",
            artType: "Painting",
            creationYear: 2022,
            quality: "High",
            delivery: "Free",
            description: "Beautiful sunset",
            isSold: false
          }
        ]
      });
    });
  });
});
