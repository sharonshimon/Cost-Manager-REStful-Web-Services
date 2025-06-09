const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../models/userModel");
const Cost = require("../models/costModel");

describe("Cost API", () => {
    let testUser;

    //Clear database and create test user before each test
    beforeEach(async () => {
        await User.deleteMany({});
        await Cost.deleteMany({});

        testUser = await User.create({
            id: "testUser",
            first_name: "test",
            last_name: "test",
            birthday: new Date("2000-01-01"),
            marital_status: "single"
        });
        await testUser.save();
    });

    //Close the database connection after all tests
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe("POST /api/add", () => {
        //Test add a valid cost for an existing user
        test("should add a new cost if user exists", async () => {
            const res = await request(app).post("/api/add").send({
                description: "Lunch",
                category: "food",
                userid: testUser.id,
                sum: 30,
            });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty("_id");
            expect(res.body.category).toBe("food");
        });

        //Test do not add cost for non-existent user
        test("should not add cost for non-existent user", async () => {
            const res = await request(app).post("/api/add").send({
                description: "Dinner",
                category: "food",
                userid: "nonexistent123",
                sum: 20,
            });

            expect(res.statusCode).toBe(404);
        });

        //Test validate that required fields are provided
        test("should validate required fields", async () => {
            const res = await request(app).post("/api/add").send({
                userid: testUser.id,
            });

            expect(res.statusCode).toBe(400);
        });

        //Test reject invalid category values
        test("should validate category", async () => {
            const res = await request(app).post("/api/add").send({
                description: "Test",
                category: "invalid-category",
                userid: testUser.id,
                sum: 10,
            });

            expect(res.statusCode).toBe(400);
        });

        //Test reject negative or zero sums
        test("should validate sum is a positive number", async () => {
            const res = await request(app).post("/api/add").send({
                description: "Test",
                category: "food",
                userid: testUser.id,
                sum: -5,
            });

            expect(res.statusCode).toBe(400);
        });
    });

    describe("GET /api/report", () => {
        //Test return a report for valid user and date
        test("should return a report for valid user and date", async () => {
            const costDate = new Date();
            await request(app).post("/api/add").send({
                description: "Breakfast",
                category: "food",
                userid: testUser.id,
                sum: 15,
                created_at: costDate
            });

            const today = new Date();
            const res = await request(app).get(
                `/api/report?id=${testUser.id}&month=${today.getMonth() + 1}&year=${today.getFullYear()}`
            );

            expect(res.statusCode).toBe(200);

            //Check if response contains costs at least one item
            const totalItems = Object.values(res.body.costs).flat().length;
            expect(totalItems).toBeGreaterThan(0);
        });

        //Test return 404 for unknown user
        test("should return 404 for non-existent user", async () => {
            const res = await request(app).get(
                `/api/report?userid=unknown123&month=6&year=2025`
            );

            expect(res.statusCode).toBe(404);
        });

        //Test return empty report if month is invalid
        test("should return empty report for invalid month", async () => {
            const res = await request(app).get(
                `/api/report?userid=${testUser.id}&month=99&year=2025`
            );

            expect(res.statusCode).toBe(400);
        });
    });
});
