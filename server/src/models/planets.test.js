const request = require('supertest');
const app = require('../app');

describe("Test GET /planets", () => {
    it("should respond with 200 success", async () => {
        const response = await request(app)
            .get("/planets")
            .expect('Content-type', /json/)
            .expect(200);
    })
})