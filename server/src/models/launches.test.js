const request = require('supertest');
const app = require('../app');

describe ('Test GET /launches', () => {
    it('should respond with 200 success', async () => {
        const response = await request(app)
            .get('/launches')
            .expect('Content-type', /json/)
            .expect(200);
    })
})

describe ('Test POST /launch: add a new launch', () => {
    const completeLaunch = {
        mission: "USS Enterprise",
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'Jan 4, 2028'
    }
    const launchWithoutDate = {
        mission: "USS Enterprise",
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
    }
    const launchWithWrongtDate = {
        mission: "USS Enterprise",
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'wrong'
    }
    it('should respond with 201 success', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunch)
            .expect('Content-type', /json/)
            .expect(201);
        const requestDate = new Date(completeLaunch.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(response.body).toMatchObject(launchWithoutDate);
        expect(requestDate).toBe(responseDate);
    })
    it('should catch missing required properties', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchWithoutDate)
            .expect('Content-type', /json/)
            .expect(400);
        expect(response.body).toStrictEqual({ error: 'Missing input data property' });    
    })
    it('should catch invalid date', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchWithWrongtDate)
            .expect('Content-type', /json/)
            .expect(400);
        expect(response.body).toStrictEqual({ error: 'Invalid date format' });    
    })
})

describe ('Test DELETE /launches/:id: abort a launch', () => {
    const launchId = 100;
    it('should respond with 200 success', async () => {
        const response = await request(app)
            .delete(`/launches/${launchId}`)
            .expect('Content-type', /json/)
            .expect(200);
        expect(response.body).toHaveProperty('upcoming', false);
        expect(response.body).toHaveProperty('success', false);
    })
})
