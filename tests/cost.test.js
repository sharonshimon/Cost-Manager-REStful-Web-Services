const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Cost Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  it("should add a new cost", async () => {
    const response = await request(app).post("/api/add").send({
      description: "Tables",
      category: "housing",
      userid: "123123",
      sum: 1500,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("description", "Tables");
    expect(response.body).toHaveProperty("sum", 1500);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});