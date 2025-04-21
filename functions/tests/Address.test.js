const request = require("supertest");
const express = require("express");
const addressRoutes = require("../routes/Address");
const Address = require("../Model/Address");

// Mock passport middleware
jest.mock("passport", () => ({
  authenticate: () => (req, res, next) => {
    req.user = { _id: "mockUserId", email: "test@example.com" };
    next();
  }
}));

// Mock the Address model
jest.mock("../Model/Address");

const app = express();
app.use(express.json());
app.use("/address", addressRoutes);

describe("Address Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /address/createOrUpdate", () => {
    it("should create a new address if none exists", async () => {
      Address.findOne.mockResolvedValue(null);
      Address.prototype.save = jest.fn().mockResolvedValue({
        _id: "newAddressId",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        address: "123 Test St",
        region: "Region A",
        city: "City B",
        moreInfo: "Near the park",
        userId: "mockUserId",
      });

      const response = await request(app)
        .post("/address/createOrUpdate")
        .send({
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "1234567890",
          address: "123 Test St",
          region: "Region A",
          city: "City B",
          moreInfo: "Near the park",
        });

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("John");
      expect(Address.prototype.save).toHaveBeenCalled();
    });

    it("should update existing address if it exists", async () => {
      const existingAddress = {
        firstName: "Old",
        lastName: "Name",
        phoneNumber: "0000000000",
        address: "Old address",
        region: "Old region",
        city: "Old city",
        moreInfo: "Old info",
        save: jest.fn().mockResolvedValue({ firstName: "Updated", lastName: "Name" }),
      };

      Address.findOne.mockResolvedValue(existingAddress);

      const response = await request(app)
        .post("/address/createOrUpdate")
        .send({ firstName: "Updated" });

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe("Updated");
      expect(existingAddress.save).toHaveBeenCalled();
    });

    it("should handle server error", async () => {
      Address.findOne.mockRejectedValue(new Error("DB error"));

      const response = await request(app)
        .post("/address/createOrUpdate")
        .send({});

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error creating/updating address for user");
    });
  });

  describe("GET /address/fetch", () => {
    it("should fetch and return user address", async () => {
      Address.findOne.mockResolvedValue({
        _id: "addressId",
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: "9876543210",
        address: "456 New St",
        region: "Region Z",
        city: "City Y",
        moreInfo: "Behind the school",
      });

      const response = await request(app).get("/address/fetch");

      expect(response.status).toBe(200);
      expect(response.body.data.firstName).toBe("Jane");
      expect(response.body.data.email).toBe("test@example.com");
    });

    it("should handle fetch error", async () => {
      Address.findOne.mockRejectedValue(new Error("Fetch error"));

      const response = await request(app).get("/address/fetch");

      expect(response.body.error).toBe("Error fetching address of the user");
    });
  });
});
