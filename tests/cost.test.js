const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Cost Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  it("should add a new cost", async () => {
    const response = await request(app).post("/api/add").send({
      description: "Groceries",
      category: "food",
      userid: "123123",
      sum: 100,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("description", "Groceries");
    expect(response.body).toHaveProperty("sum", 100);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});