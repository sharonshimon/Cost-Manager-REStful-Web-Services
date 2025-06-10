const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/user_model");

const existingUser = {
    id: "123123",
    first_name: "mosh",
    last_name: "israeli",
    birthday: "1990-01-01",
    marital_status: "single"
};

//Close the database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe("User API", () => {
    //Test creating a duplicate of existing user
    test("should not create a duplicate user", async () => {
        const res = await request(app).post("/api/users/add").send(existingUser);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "User already exists");
    });

    //Test getting existing user details
    test("should get existing user details by ID", async () => {
        const res = await request(app).get(`/api/users/${existingUser.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("first_name", existingUser.first_name);
        expect(res.body).toHaveProperty("last_name", existingUser.last_name);
    });

    //Test failure when required fields are missing
    test("should not create a user with missing fields", async () => {
        const res = await request(app).post("/api/users/add").send({
            id: existingUser.id,  // Using existing ID to avoid accidental creation
            first_name: "Jane",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "All fields are required");
    });

    //Test non-existent user lookup
    test("should return 404 if user not found", async () => {
        const res = await request(app).get("/api/users/nonexistent_id");

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "User not found");
    });
});