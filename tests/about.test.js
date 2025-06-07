const request = require('supertest');
const app = require('../app');
const mongoose = require("mongoose");


describe('GET /api/about', () => {
    ////Close the database connection after all tests
    afterAll(async () => {
        await mongoose.connection.close();
    });

    //Test if the /api/about endpoint returns a list of team members
    test('should return a list of team members', async () => {
        const res = await request(app).get('/api/about');

        expect(res.statusCode).toBe(200);

        //Check if the response is an array
        expect(Array.isArray(res.body)).toBe(true);

        //Check if the array has two members
        expect(res.body.length).toBe(2);

        //Check if each member has the required properties
        res.body.forEach(member => {
            expect(member).toHaveProperty('first_name');
            expect(member).toHaveProperty('last_name');
            expect(member).toHaveProperty('id');
            expect(member).toHaveProperty('email');
        });
    });
});
