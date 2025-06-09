const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/userModel");


//Clean up the database after each test
afterEach(async () => {
    await User.deleteMany();
});

//Close the database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe("User API", () => {
    //Test creating a new user
    test("should create a new user", async () => {
        const res = await request(app).post("/api/users/add").send({
            id: "999999999",
            first_name: "Joe",
            last_name: "Cohen",
            birthday: "1994-01-01",
            marital_status: "single",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id", "999999999");
        expect(res.body).toHaveProperty("first_name", "Joe");
    });

    //Test failure when required fields are missing
    test("should not create a user with missing fields", async () => {
        const res = await request(app).post("/api/users/add").send({
            id: "888888888",
            first_name: "Jane",
            birthday: "1994-01-02",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "All fields are required");
    });

    //Test failure when trying to create an existing user
    test("should not create a duplicate user", async () => {
        await request(app).post("/api/users/add").send({
            id: "777777777",
            first_name: "Sam",
            last_name: "Smith",
            birthday: "1992-05-05",
            marital_status: "married",
        });

        const res = await request(app).post("/api/users/add").send({
            id: "777777777",
            first_name: "Sam",
            last_name: "Smith",
            birthday: "1992-05-05",
            marital_status: "married",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "User already exists");
    });

    //Test getting user details by ID
    test("should get user details by ID", async () => {
        await request(app).post("/api/users/add").send({
            id: "111111111",
            first_name: "Dani",
            last_name: "Levi",
            birthday: "1998-06-10",
            marital_status: "single",
        });

        const res = await request(app).get("/api/users/111111111");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("first_name", "Dani");
        expect(res.body).toHaveProperty("total", 0);
    });

    //Test failure when trying to
    test("should return 404 if user not found", async () => {
        const res = await request(app).get("/api/users/000000000");

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "User not found");
    });
});
