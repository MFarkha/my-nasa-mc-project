const request = require('supertest');
const app = require('../app');
const { mongoConnect, mongoDisconnect } = require('../utils/mongo');

describe("Test GET /planets", () => {
    beforeAll(async () => {
        await mongoConnect();
    });
    afterAll(async () => {
        await mongoDisconnect();
    });
    it("should respond with 200 success", async () => {
        const response = await request(app)
            .get("/v1/planets")
            .expect('Content-type', /json/)
            .expect(200);
    })
})