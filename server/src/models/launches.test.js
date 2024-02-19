const request = require('supertest');
const app = require('../app');
const { mongoConnect, mongoDisconnect } = require('../utils/mongo');
const { loadPlanetsData } = require('./planets.model');

describe ('Test /launches API', () => {
    let newLaunchId;
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    });
    afterAll(async () => {
        await mongoDisconnect();
    });
    describe ('Test GET /launches', () => {
        it('should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-type', /json/)
                .expect(200);
        })
    });
    describe ('Test POST /launch: add a new launch', () => {
        const completeLaunch = {
            mission: "USS Enterprise",
            rocket: 'NCC 1701-D',
            target: 'Kepler-296 A e',
            launchDate: 'Jan 4, 2028'
        }
        const launchWithoutDate = {
            mission: "USS Enterprise",
            rocket: 'NCC 1701-D',
            target: 'Kepler-296 A e',
        }
        const launchWithWrongtDate = {
            mission: "USS Enterprise",
            rocket: 'NCC 1701-D',
            target: 'Kepler-296 A e',
            launchDate: 'wrong'
        }
        it('should respond with 201 success', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunch)
                .expect('Content-type', /json/)
                .expect(201);
            const requestDate = new Date(completeLaunch.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(response.body).toMatchObject(launchWithoutDate);
            newLaunchId = response.body.flightNumber;
            expect(requestDate).toBe(responseDate);
        });
        it('should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchWithoutDate)
                .expect('Content-type', /json/)
                .expect(400);
            expect(response.body).toStrictEqual({ error: 'Missing input data property' });
        });
        it('should catch invalid date', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchWithWrongtDate)
                .expect('Content-type', /json/)
                .expect(400);
            expect(response.body).toStrictEqual({ error: 'Invalid date format' });
        })
    });
    describe ('Test DELETE /launches/:id: abort a launch', () => {
        const launchId = newLaunchId || 100;
        it('should respond with 200 success', async () => {
            const response = await request(app)
                .delete(`/v1/launches/${launchId}`)
                .expect('Content-type', /json/)
                .expect(200);
            expect(response.body).toHaveProperty('ok', true);
        })
    });
})
