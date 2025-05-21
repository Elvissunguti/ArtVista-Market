const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../Server"); 
const User = require("../Model/User");
const ArtWork = require("../Model/ArtWork");
const jwt = require("jsonwebtoken");

let token;
let testUser;
let testArt;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/testdb");

  testUser = await User.create({ userName: "testuser", cartList: [], cartListNumber: 0 });
  token = jwt.sign({ _id: testUser._id }, process.env.JWT_SECRET || "SECRETKEY");

  testArt = await ArtWork.create({
    title: "Test Art",
    price: 1000,
    userId: testUser._id,
    artPhoto: ["img.jpg"],
    isSold: false,
  });
});

afterAll(async () => {
  await User.deleteMany();
  await ArtWork.deleteMany();
  await mongoose.connection.close();
});

describe("Cart Routes", () => {
  it("should add artwork to cartList", async () => {
    const res = await request(app)
      .post(`/api/cart/addcartlist/${testArt._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.message).toBe("Artwork added to cartList");
  });

  it("should get correct cartList number", async () => {
    const res = await request(app)
      .get("/api/cart/checkcartlistnumber")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data).toBe(1);
  });

  it("should return cartListed artworks", async () => {
    const res = await request(app)
      .get("/api/cart/cartlisted")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.totalPrice).toBe("1,000");
  });

  it("should remove artwork from cartList", async () => {
    const res = await request(app)
      .post(`/api/cart/deletecartlist/${testArt._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.message).toBe("Artwork removed from cartlist");
  });

  it("should show empty cart after removal", async () => {
    const res = await request(app)
      .get("/api/cart/cartlisted")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.message).toBe("There is no artwork in the cartList");
  });
});
